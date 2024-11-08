import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma.service';
import { ProfileController } from './profile.controller';
import { CompanyService } from 'src/company/company.service';
import { AnalystService } from 'src/analyst/analyst.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, CompanyService, AnalystService],
})
export class ProfileModule {}
