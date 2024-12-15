import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { PrismaService } from 'src/prisma.service';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebSocketModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, PrismaService],
  exports: [MeetingsService],
})
export class MeetingsModule {}