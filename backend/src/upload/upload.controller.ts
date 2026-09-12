import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { v2 as cloudinary } from 'cloudinary';

@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const url = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder || 'portfolio',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result.secure_url);
            else reject(new Error('Upload failed'));
          },
        )
        .end(file.buffer);
    });

    return { url };
  }
}
