import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WritingsService } from './writings.service';
import { CreateWritingDto, UpdateWritingDto } from './writing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('writings')
export class WritingsController {
  constructor(private readonly service: WritingsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tag') tag?: string,
  ) {
    return this.service.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      tag: tag || undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllForAdmin() {
    return this.service.findAllForAdmin();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWritingDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWritingDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
