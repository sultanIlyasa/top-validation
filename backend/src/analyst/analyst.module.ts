import { Module } from '@nestjs/common';
import { AnalystService } from './analyst.service';
import { AnalystController } from './analyst.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AnalystController],
  providers: [AnalystService, PrismaService],
})
export class AnalystModule {}
