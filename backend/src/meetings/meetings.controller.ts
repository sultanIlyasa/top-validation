import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, JoinMeetingDto, SignalDto } from './dto/meetings.dto';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post('initialize')
  async initializeMeeting(@Body() createMeetingDto: CreateMeetingDto) {
    try {
      const meeting = await this.meetingsService.initializeMeeting(createMeetingDto);
      return { success: true, meeting };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('join')
  async joinMeeting(@Body() joinMeetingDto: JoinMeetingDto) {
    try {
      const meeting = await this.meetingsService.joinMeeting(joinMeetingDto);
      return { success: true, meeting };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/validate')
  async validateMeeting(@Param('id') roomId: string) {
    try {
      const result = await this.meetingsService.validateMeeting(roomId);
      return { success: true, ...result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/signal')
  async handleSignal(
    @Param('id') roomId: string,
    @Body() signalDto: SignalDto,
  ) {
    try {
      await this.meetingsService.handleSignal(roomId, signalDto);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/end')
  async endMeeting(@Param('id') roomId: string) {
    try {
      await this.meetingsService.endMeeting(roomId);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}