import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StudentProfile } from './entities/student-profile.entity';
import { SchoolAdmin } from './entities/school-admin.entity';
import { TutorProfile } from './entities/tutor-profile.entity';
import { StudyActivity } from './entities/study-activity.entity';
import { StudyStreak } from './entities/study-streak.entity';
import { TopicMasteryHistory } from './entities/topic-mastery-history.entity';
import { WeakTopic } from './entities/weak-topic.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      StudentProfile,
      SchoolAdmin,
      TutorProfile,
      StudyActivity,
      StudyStreak,
      TopicMasteryHistory,
      WeakTopic,
    ]),
  ],
})
export class UserModule {}
