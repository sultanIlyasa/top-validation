import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';
import { CompanyModule } from './company/company.module';
import { AnalystModule } from './analyst/analyst.module';
import { CompanyService } from './company/company.service';
import { AnalystService } from './analyst/analyst.service';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfileModule,
    CompanyModule,
    AnalystModule,
    ScheduleModule,
  ],
  controllers: [AppController, ProfileController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    ProfileService,
    CompanyService,
    AnalystService,
  ],
  exports: [PrismaService],
})
export class AppModule {}
