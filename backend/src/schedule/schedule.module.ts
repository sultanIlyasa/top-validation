import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, AuthGuard, RolesGuard],
  exports: [ScheduleService],
})
export class ScheduleModule {}
