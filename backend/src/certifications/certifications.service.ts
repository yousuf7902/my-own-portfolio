import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error as MongooseError, Model } from 'mongoose';
import { Certification } from './certification.schema';
import { CreateCertificationDto, UpdateCertificationDto } from './certification.dto';

@Injectable()
export class CertificationsService {
  constructor(
    @InjectModel(Certification.name)
    private readonly model: Model<Certification>,
  ) {}

  findAll() {
    return this.model.find().sort({ order: 1 });
  }

  async create(dto: CreateCertificationDto) {
    try {
      return await this.model.create(dto);
    } catch (err) {
      if (err instanceof MongooseError.ValidationError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateCertificationDto) {
    try {
      const item = await this.model.findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      });
      if (!item) throw new NotFoundException('Certification not found');
      return item;
    } catch (err) {
      if (err instanceof MongooseError.ValidationError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Certification not found');
    return { success: true };
  }
}
