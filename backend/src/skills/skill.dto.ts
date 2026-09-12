import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';

export const SKILL_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'Tools',
] as const;

export class CreateSkillDto {
  @IsString() name: string;
  @IsOptional() @IsString() icon?: string;
  @IsNumber() @Min(0) @Max(100) percentage: number;
  @IsOptional() @IsIn(SKILL_CATEGORIES) category?: string;
  @IsOptional() @IsNumber() order?: number;
}

export class UpdateSkillDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100) percentage?: number;
  @IsOptional() @IsIn(SKILL_CATEGORIES) category?: string;
  @IsOptional() @IsNumber() order?: number;
}
