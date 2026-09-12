import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Achievement, AchievementSchema } from './achievement.schema';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Achievement.name, schema: AchievementSchema }])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
