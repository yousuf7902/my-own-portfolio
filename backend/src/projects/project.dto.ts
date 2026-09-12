import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString() title: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() fullDescription?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsNumber() thumbnailIndex?: number;
  @IsOptional() @IsString() liveLink?: string;
  @IsOptional() @IsString() githubLink?: string;
  @IsOptional() @IsArray() technologies?: string[];
  @IsOptional() @IsArray() highlights?: string[];
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsNumber() order?: number;
}

export class UpdateProjectDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() fullDescription?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsNumber() thumbnailIndex?: number;
  @IsOptional() @IsString() liveLink?: string;
  @IsOptional() @IsString() githubLink?: string;
  @IsOptional() @IsArray() technologies?: string[];
  @IsOptional() @IsArray() highlights?: string[];
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsNumber() order?: number;
}
