import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomWebSocketGateway } from '../websocket/websocket.gateway';
import {
  CreateMeetingDto,
  JoinMeetingDto,
  SignalDto,
} from './dto/meetings.dto';

@Injectable()
export class MeetingsService {
  constructor(
    private prisma: PrismaService,
    private webSocketGateway: CustomWebSocketGateway,
  ) {}

  async initializeMeeting(createMeetingDto: CreateMeetingDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: createMeetingDto.analystId,
        role: 'ANALYST',
      },
      include: {
        analyst: true,
        videoCallsAsAnalyst: true,
      },
    });

    console.log(user);
    if (!user?.analyst) {
      throw new BadRequestException(
        'Invalid analyst ID or user is not an analyst',
      );
    }

    const activeVideoCall = user.videoCallsAsAnalyst[0];
    if (!activeVideoCall) {
      throw new ForbiddenException('No scheduled meeting found for this time');
    }

    // Update video call status to CONNECTED
    const updatedVideoCall = await this.prisma.videoCall.update({
      where: { id: activeVideoCall.id },
      data: { status: 'CONNECTED' },
      include: {
        schedule: {
          include: {
            company: true,
            analyst: true,
          },
        },
      },
    });

    return updatedVideoCall;
  }

  async joinMeeting(joinMeetingDto: JoinMeetingDto) {
    const videoCall = await this.prisma.videoCall.findFirst({
      where: {
        roomId: joinMeetingDto.roomId,
        companyId: joinMeetingDto.companyId,
        status: {
          in: ['WAITING', 'CONNECTED'],
        },
      },
      include: {
        schedule: {
          include: {
            company: true,
            analyst: true,
          },
        },
      },
    });

    if (!videoCall) {
      throw new NotFoundException('Meeting not found or not available');
    }

    const company = await this.prisma.user.findUnique({
      where: {
        id: joinMeetingDto.companyId,
        role: 'COMPANY',
      },
      include: { company: true },
    });

    if (!company?.company) {
      throw new BadRequestException(
        'Invalid company ID or user is not a company',
      );
    }

    // Verify the company is the one scheduled for this meeting
    if (videoCall.companyId !== joinMeetingDto.companyId) {
      throw new ForbiddenException('You are not scheduled for this meeting');
    }

    // If meeting hasn't started yet, wait for analyst
    if (videoCall.status === 'WAITING') {
      return {
        status: 'waiting',
        message: 'Waiting for analyst to start the meeting',
        videoCall,
      };
    }

    return {
      status: 'connected',
      videoCall,
    };
  }

  async validateMeeting(roomId: string) {
    const videoCall = await this.prisma.videoCall.findFirst({
      where: {
        roomId: roomId,
        status: {
          in: ['WAITING', 'CONNECTED'],
        },
      },
      include: {
        schedule: {
          include: {
            company: true,
            analyst: true,
          },
        },
      },
    });

    if (!videoCall) {
      throw new NotFoundException('Meeting not found or has ended');
    }

    return {
      isValid: true,
      videoCall,
    };
  }

  async handleSignal(roomId: string, signalDto: SignalDto) {
    const videoCall = await this.prisma.videoCall.findFirst({
      where: {
        roomId: roomId,
        status: 'CONNECTED',
      },
    });

    if (!videoCall) {
      throw new NotFoundException('Active meeting not found');
    }

    // Broadcast the signal to all participants in the meeting room
    this.webSocketGateway.server.to(roomId).emit('signal', {
      type: signalDto.type,
      signal: signalDto.signal,
    });

    return true;
  }

  async endMeeting(roomId: string) {
    const videoCall = await this.prisma.videoCall.findFirst({
      where: {
        roomId: roomId,
        status: 'CONNECTED',
      },
      include: {
        schedule: true,
      },
    });

    if (!videoCall) {
      throw new NotFoundException('Active meeting not found');
    }

    await this.prisma.$transaction([
      // Update video call status
      this.prisma.videoCall.update({
        where: { id: videoCall.id },
        data: { status: 'ENDED' },
      }),
      // Update schedule status
      this.prisma.schedule.update({
        where: { id: videoCall.schedule.id },
        data: { status: 'COMPLETED' },
      }),
    ]);

    // Notify all participants that the meeting has ended
    this.webSocketGateway.server.to(roomId).emit('meeting-ended');

    return { success: true };
  }
}
