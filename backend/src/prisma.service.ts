import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable() // 👈 Add this decorator
export class PrismaService // 👈 Add this class
  extends PrismaClient     // 👈 Extend the PrismaClient
  implements OnModuleInit, OnModuleDestroy // 👈 Implement the lifecycle hooks
{
  async onModuleInit() { // 👈 Implement the onModuleInit() lifecycle hook
    await this.$connect(); // 👈 Connect to the database
  }

  async onModuleDestroy() { // 👈 Implement the onModuleDestroy() lifecycle hook
    await this.$disconnect(); // 👈 Disconnect from the database
  }
}
