import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto, UpdateAchievementDto } from './achievement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly service: AchievementsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAchievementDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
