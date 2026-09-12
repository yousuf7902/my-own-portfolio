import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto, UpdateCertificationDto } from './certification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('certifications')
export class CertificationsController {
  constructor(private readonly service: CertificationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCertificationDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificationDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
