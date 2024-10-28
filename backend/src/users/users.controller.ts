import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('api/users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
