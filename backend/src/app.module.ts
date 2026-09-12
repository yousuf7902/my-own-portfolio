import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { CertificationsModule } from './certifications/certifications.module';
import { WritingsModule } from './writings/writings.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'),
    AuthModule,
    AboutModule,
    SkillsModule,
    ProjectsModule,
    AchievementsModule,
    ExperiencesModule,
    CertificationsModule,
    WritingsModule,
    UploadModule,
  ],
})
export class AppModule {}
