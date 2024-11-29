import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  companyId: string; // The ID of the company requesting the schedule

  @IsNotEmpty()
  @IsDate()
  date: Date; // The date of the schedule

  @IsNotEmpty()
  @IsDate()
  startTime: Date; // Start time for the schedule

  @IsNotEmpty()
  @IsDate()
  endTime: Date; // End time for the schedule
}
