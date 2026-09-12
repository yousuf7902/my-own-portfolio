import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('password') password: string) {
    return this.authService.login(password);
  }

  @Get('check')
  async check(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    return this.authService.check(token);
  }
}
