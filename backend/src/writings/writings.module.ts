import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Writing, WritingSchema } from './writing.schema';
import { WritingsService } from './writings.service';
import { WritingsController } from './writings.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Writing.name, schema: WritingSchema }])],
  controllers: [WritingsController],
  providers: [WritingsService],
})
export class WritingsModule {}
