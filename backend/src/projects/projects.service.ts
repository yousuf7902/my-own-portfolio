import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly model: Model<Project>,
  ) {}

  findAll() {
    return this.model.find().sort({ order: 1 });
  }

  create(dto: CreateProjectDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateProjectDto) {
    const item = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Project not found');
    return item;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Project not found');
    return { success: true };
  }
}
