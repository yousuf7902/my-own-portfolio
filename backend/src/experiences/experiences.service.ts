import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience } from './experience.schema';
import { CreateExperienceDto, UpdateExperienceDto } from './experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectModel(Experience.name)
    private readonly model: Model<Experience>,
  ) {}

  findAll() {
    return this.model.find().sort({ order: 1 });
  }

  private normalize<T extends { organization?: string }>(dto: T): T {
    return dto.organization
      ? { ...dto, organization: dto.organization.trim() }
      : dto;
  }

  create(dto: CreateExperienceDto) {
    return this.model.create(this.normalize(dto));
  }

  async update(id: string, dto: UpdateExperienceDto) {
    const item = await this.model.findByIdAndUpdate(id, this.normalize(dto), {
      new: true,
    });
    if (!item) throw new NotFoundException('Experience not found');
    return item;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Experience not found');
    return { success: true };
  }
}
