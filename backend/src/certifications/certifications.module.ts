import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Certification, CertificationSchema } from './certification.schema';
import { CertificationsService } from './certifications.service';
import { CertificationsController } from './certifications.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Certification.name, schema: CertificationSchema }])],
  controllers: [CertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule {}
