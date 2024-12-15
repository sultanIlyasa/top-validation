import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma.service';
import { Schedule, ScheduleStatus, VideoCall } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(dto: CreateScheduleDto): Promise<Schedule> {
    // Verify company exists
    const company = await this.prisma.user.findUnique({
      where: { id: dto.companyId },
    }); // Find the company by ID

    if (!company) {
      throw new BadRequestException('Company not found'); // Throw an error if company is not found
    }

    // Check for scheduling conflicts for the company
    const conflictSchedule = await this.prisma.schedule.findFirst({
      where: {
        companyId: dto.companyId, // Find the company by ID
        date: dto.date, // Find the date
        AND: [
          // Use AND to combine the following conditions
          {
            OR: [
              { startTime: { lte: dto.startTime, gt: dto.endTime } }, // Check if the start time is less than or equal to the new start time and greater than the new end time
              { endTime: { gte: dto.startTime, lt: dto.endTime } }, // Check if the end time is greater than or equal to the new start time and less than the new end time
            ],
          },
        ],
      },
    });

    if (conflictSchedule) {
      throw new BadRequestException(
        'Company already has a schedule at this time',
      );
    }

    // Create schedule with the nested structure for `company`
    return this.prisma.schedule.create({
      data: {
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: 'PENDING',
        company: {
          connect: { id: dto.companyId }, // Nesting the company with the connect field
        },
        // Include the analyst field as undefined
      },
      include: {
        company: {
          select: {
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    });
  }

  async updateScheduleStatus(
    scheduleId: string,
    analystId: string,
    status: ScheduleStatus,
  ): Promise<Schedule> {
    console.log('1. Initial analystId:', analystId);
    console.log('1. Initial status:', status);

    // Verify analyst exists
    const analyst = await this.prisma.user.findUnique({
      where: { id: analystId },
      include: { analyst: true },
    });
    console.log('2. Found analyst:', analyst);

    if (!analyst?.analyst) {
      throw new BadRequestException('Analyst not found');
    }

    // Get the schedule
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    console.log('3. Found schedule:', schedule);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Check status conditions
    if (schedule.analystId && status === 'CONFIRMED') {
      throw new BadRequestException('Schedule already assigned to an analyst');
    }

    if (schedule.status !== 'PENDING' && status === 'CONFIRMED') {
      throw new BadRequestException('Schedule is not in PENDING status');
    }

    // Check for conflicts
    if (status === 'CONFIRMED') {
      console.log('4. Checking conflicts with analystId:', analystId);
      const analystConflict = await this.prisma.schedule.findFirst({
        where: {
          analystId,
          date: schedule.date,
          AND: [
            {
              OR: [
                {
                  startTime: { lte: schedule.startTime, gt: schedule.endTime },
                },
                { endTime: { gte: schedule.startTime, lt: schedule.endTime } },
                {
                  AND: [
                    { startTime: { gte: schedule.startTime } },
                    { endTime: { lte: schedule.endTime } },
                  ],
                },
              ],
            },
          ],
        },
      });
      console.log('5. Conflict check result:', analystConflict);

      if (analystConflict) {
        throw new BadRequestException(
          'You already have a schedule at this time',
        );
      }
    }

    // Handle rejected status
    if (status === 'REJECTED') {
      console.log('6. Handling REJECTED status');
      return this.prisma.schedule.update({
        where: { id: scheduleId },
        data: {
          status: 'REJECTED',
          analystId: null,
        },
        include: {
          company: {
            select: {
              firstName: true,
              lastName: true,
              company: true,
            },
          },
          analyst: {
            select: {
              firstName: true,
              lastName: true,
              analyst: true,
            },
          },
        },
      });
    }

    // Handle confirmed status
    return this.prisma.$transaction(async (prisma) => {
      console.log('7. Starting transaction with analystId:', analystId);
      console.log('7. Status is:', status);
      console.log(
        '7. Condition result:',
        status === 'CONFIRMED' ? analystId : null,
      );

      const updatedSchedule = await prisma.schedule.update({
        where: { id: scheduleId },
        data: {
          analystId: status === 'CONFIRMED' ? analystId : null,
          status,
        },
        include: {
          company: {
            select: {
              firstName: true,
              lastName: true,
              company: true,
            },
          },
          analyst: {
            select: {
              firstName: true,
              lastName: true,
              analyst: true,
            },
          },
        },
      });
      console.log('8. Updated schedule result:', updatedSchedule);

      if (status === 'CONFIRMED' && analystId) {
        console.log('9. Creating video call with analystId:', analystId);
        const videoCall = await prisma.videoCall.create({
          data: {
            scheduleId: schedule.id,
            companyId: schedule.companyId,
            analystId,
            roomId: `room_${schedule.id}`,
            status: 'WAITING',
            videoUrl: '',
            expiredDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          },
        });
        console.log('10. Created video call:', videoCall);
      }

      return updatedSchedule;
    });
  }
  async getAvailableSchedules(): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: {
        analystId: null,
        status: 'PENDING',
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        company: {
          select: {
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    });
  }

  async getAnalystSchedules(analystId: string): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { analystId },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        company: {
          select: {
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    });
  }

  async getAllSchedules(): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        company: {
          select: {
            firstName: true,
            lastName: true,
            company: true,
          },
        },
        analyst: {
          select: {
            firstName: true,
            lastName: true,
            analyst: true,
          },
        },
        videoCall: {
          select: {
            id: true,
            roomId: true,
          },
        },
      },
    });
  }

  async getClosestSchedule(analystId: string): Promise<Schedule> {
    return this.prisma.schedule.findFirst({
      where: {
        analystId,
        date: { gte: new Date().toISOString() },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        company: {
          select: {
            firstName: true,
            lastName: true,
            company: true,
          },
        },
        videoCall: {
          select: {
            id: true,
            roomId: true,
          },
        },
      },
    });
  }

  async getCompanySchedules(companyId: string): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { companyId },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        analyst: {
          select: {
            firstName: true,
            lastName: true,
            analyst: true,
          },
        },
      },
    });
  }

  async deleteScheduleById(scheduleId: string) {
    const schedule = await this.prisma.schedule.delete({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return 'Schedule deleted successfully';
  }
}
