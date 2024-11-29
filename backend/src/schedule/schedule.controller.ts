import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Role } from '@prisma/client';
import { error } from 'console';

@Controller('schedule')
@UseGuards(AuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create/:id')
  @Roles(Role.COMPANY) // Only allow COMPANY role
  createSchedule(@Body() dto: CreateScheduleDto, @CurrentUser() user: any) {
    // Ensure the company can only create schedules for themselves
    return this.scheduleService.createSchedule(dto);
  }

  @Patch('update/:id')
  @Roles(Role.ANALYST)
  async updateScheduleStatus(
    @Param('id') scheduleId: string,
    @Body() dto: UpdateScheduleDto,
    @CurrentUser() user: any,
  ) {
    console.log('Controller - Full user object:', user);
    console.log('Controller - Schedule ID:', scheduleId);
    console.log('Controller - Status:', dto.status);
    const analystId = user.sub;
    console.log('Controller - Analyst ID:', analystId);

    return this.scheduleService.updateScheduleStatus(
      scheduleId,
      analystId,
      dto.status,
    );
  }
  @Get('analyst/:analystId')
  @Roles('ANALYST')
  async getAnalystSchedules(@Param('analystId') analystId: string) {
    return this.scheduleService.getAnalystSchedules(analystId);
  }

  @Get('company/:companyId')
  @Roles('COMPANY')
  async getCompanySchedules(@Param('companyId') companyId: string) {
    return this.scheduleService.getCompanySchedules(companyId);
  }

  @Get('available/:analystId/')
  @Roles('ANALYST')
  async getAvailableSchedules(@Param('analystId') analystId: string) {
    return this.scheduleService.getAvailableSchedules();
  }

  @Post('delete/:id')
  async deleteSchedule(@Param('id') scheduleId: string) {
    return this.scheduleService.deleteScheduleById(scheduleId);
  }
}
