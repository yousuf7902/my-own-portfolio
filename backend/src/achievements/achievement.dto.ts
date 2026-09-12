import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAchievementDto {
  @IsString() label: string;
  @IsNumber() value: number;
  @IsOptional() @IsString() suffix?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() order?: number;
}

export class UpdateAchievementDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsNumber() value?: number;
  @IsOptional() @IsString() suffix?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() order?: number;
}
