import { IsEnum, IsNotEmpty } from 'class-validator';
import { ScheduleStatus } from '@prisma/client';

export class UpdateScheduleDto {
  @IsNotEmpty()
  @IsEnum(ScheduleStatus, {
    message: 'Status must be either PENDING, CONFIRMED, or REJECTED',
  })
  status: ScheduleStatus; // Status update for the schedule
}
