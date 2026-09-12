import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from './experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly service: ExperiencesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateExperienceDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
