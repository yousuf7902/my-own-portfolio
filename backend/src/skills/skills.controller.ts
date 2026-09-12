import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './skill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
