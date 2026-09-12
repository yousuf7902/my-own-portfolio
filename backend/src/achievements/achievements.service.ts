import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement } from './achievement.schema';
import { CreateAchievementDto, UpdateAchievementDto } from './achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name)
    private readonly model: Model<Achievement>,
  ) {}

  findAll() {
    return this.model.find().sort({ order: 1 });
  }

  create(dto: CreateAchievementDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateAchievementDto) {
    const item = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Achievement not found');
    return item;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Achievement not found');
    return { success: true };
  }
}
