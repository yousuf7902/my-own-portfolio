import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './about.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async get() {
    return this.aboutService.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() dto: UpdateAboutDto) {
    return this.aboutService.update(dto);
  }
}
