import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error as MongooseError, Model } from 'mongoose';
import { Writing } from './writing.schema';
import { CreateWritingDto, UpdateWritingDto } from './writing.dto';

const WPM = 200;

const DEFAULT_PAGE_SIZE = 7;
const MAX_PAGE_SIZE = 50;

function clamp(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readTimeOf(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

@Injectable()
export class WritingsService {
  constructor(
    @InjectModel(Writing.name)
    private readonly model: Model<Writing>,
  ) {}

  async findAll(options: { page?: number; limit?: number; tag?: string } = {}) {
    const limit = clamp(
      options.limit ?? DEFAULT_PAGE_SIZE,
      1,
      MAX_PAGE_SIZE,
      DEFAULT_PAGE_SIZE,
    );
    const requestedPage = clamp(options.page ?? 1, 1, Number.MAX_SAFE_INTEGER, 1);

    const published = { draft: false, publishedAt: { $lte: new Date() } };
    const filter = options.tag ? { ...published, tags: options.tag } : published;

    const [total, totalPublished, tagCounts] = await Promise.all([
      this.model.countDocuments(filter),

      this.model.countDocuments(published),
      this.model.aggregate<{ _id: string; count: number }>([
        { $match: published },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));

    const page = Math.min(requestedPage, pages);

    const items = await this.model
      .find(filter)
      .select('-body')
      .sort({ publishedAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      items,
      total,
      totalPublished,
      page,
      pages,
      limit,
      tagCounts: tagCounts.map((t) => ({ tag: t._id, count: t.count })),
    };
  }

  findAllForAdmin() {
    return this.model.find().sort({ publishedAt: -1 });
  }

  async findBySlug(slug: string) {
    const item = await this.model.findOne({ slug, draft: false });
    if (!item) throw new NotFoundException('Writing not found');

    const published = { draft: false, publishedAt: { $lte: new Date() } };
    const at = item.publishedAt;
    const id = item._id;
    const neighbour = (
      order: 1 | -1,
    ) =>
      this.model
        .findOne({
          ...published,
          _id: { $ne: id },
          $or: [
            { publishedAt: order === 1 ? { $gt: at } : { $lt: at } },
            { publishedAt: at, _id: order === 1 ? { $gt: id } : { $lt: id } },
          ],
        })
        .select('title slug')
        .sort({ publishedAt: order, _id: order });

    const [previous, next] = await Promise.all([
      neighbour(-1),
      neighbour(1),
    ]);

    return { ...item.toObject(), previous, next };
  }

  async create(dto: CreateWritingDto) {
    try {
      return await this.model.create(this.prepare(dto, dto.title));
    } catch (err) {
      throw this.translate(err);
    }
  }

  async update(id: string, dto: UpdateWritingDto) {
    try {
      const item = await this.model.findByIdAndUpdate(
        id,
        this.prepare(dto),
        { new: true, runValidators: true },
      );
      if (!item) throw new NotFoundException('Writing not found');
      return item;
    } catch (err) {
      throw this.translate(err);
    }
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Writing not found');
    return { success: true };
  }

  private prepare(
    dto: CreateWritingDto | UpdateWritingDto,
    titleFallback?: string,
  ) {
    const prepared: Record<string, unknown> = { ...dto };

    const slugSource = dto.slug || titleFallback;
    if (slugSource) prepared.slug = slugify(slugSource);

    if (dto.body !== undefined) prepared.readTime = readTimeOf(dto.body);

    if (titleFallback && !dto.publishedAt) prepared.publishedAt = new Date();

    return prepared;
  }

  private translate(err: unknown) {
    if (err instanceof MongooseError.ValidationError) {
      return new BadRequestException(err.message);
    }

    if (
      typeof err === 'object' &&
      err !== null &&
      (err as { code?: number }).code === 11000
    ) {
      return new ConflictException('A writing with that slug already exists');
    }
    return err;
  }
}
