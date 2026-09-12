import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateWritingDto {
  @IsString() title: string;
  @IsOptional() @IsString() slug?: string;
  @IsString() excerpt: string;
  @IsString() body: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsDateString() publishedAt?: string;
  @IsOptional() @IsBoolean() draft?: boolean;
}

export class UpdateWritingDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsDateString() publishedAt?: string;
  @IsOptional() @IsBoolean() draft?: boolean;
}
