import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill } from './skill.schema';
import { CreateSkillDto, UpdateSkillDto } from './skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name)
    private readonly model: Model<Skill>,
  ) {}

  findAll() {
    return this.model.find().sort({ order: 1 });
  }

  create(dto: CreateSkillDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateSkillDto) {
    const item = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Skill not found');
    return item;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Skill not found');
    return { success: true };
  }
}
