import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsArray } from 'class-validator';

export class CreateExperienceDto {
  @IsString() title: string;
  @IsString() organization: string;
  @IsOptional() @IsEnum(['work', 'education', 'volunteer']) type?: 'work' | 'education' | 'volunteer';
  @IsDateString() startDate: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() technologies?: string[];
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() order?: number;
}

export class UpdateExperienceDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() organization?: string;
  @IsOptional() @IsEnum(['work', 'education', 'volunteer']) type?: 'work' | 'education' | 'volunteer';
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() technologies?: string[];
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() order?: number;
}
