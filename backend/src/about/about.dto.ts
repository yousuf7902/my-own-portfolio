import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';

export class UpdateAboutDto {
  @IsOptional() @IsString() greeting?: string;
  @IsOptional() @IsString() greetingSuffix?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsArray() roles?: string[];
  @IsOptional() @IsString() heroBio?: string;
  @IsOptional() @IsString() aboutText?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() resumeLink?: string;
  @IsOptional() @IsString() profileImage?: string;
  @IsOptional() @IsObject() socials?: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}
