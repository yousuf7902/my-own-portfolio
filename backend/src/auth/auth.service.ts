import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new UnauthorizedException('Admin password not configured');
    }

    if (password !== adminPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async check(token: string) {
    try {
      this.jwtService.verify(token);
      return { authenticated: true };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
