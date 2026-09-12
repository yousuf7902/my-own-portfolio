import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCertificationDto {
  @IsString() title: string;
  @IsString() issuer: string;
  @IsString() year: string;
  @IsString() image: string;
  @IsOptional() @IsString() verifyLink?: string;
  @IsOptional() @IsNumber() order?: number;
}

export class UpdateCertificationDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() issuer?: string;
  @IsOptional() @IsString() year?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() verifyLink?: string;
  @IsOptional() @IsNumber() order?: number;
}
