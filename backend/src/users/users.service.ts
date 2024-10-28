import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async findOne(email: String) {
    return await this.prisma.user.findUnique({
      where: { email: String(email) },
      include: {
        company: true,
        analyst: true,
        admin: true,
      },
    });
  }
}
