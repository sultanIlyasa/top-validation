import { Injectable } from '@nestjs/common';
import { CreateAnalystDto } from './dto/create-analyst.dto';
import { UpdateAnalystDto } from './dto/update-analyst.dto';
import { PrismaService } from 'src/prisma.service';
import { Analyst, Prisma } from '@prisma/client';

@Injectable()
export class AnalystService {
  constructor(private prisma: PrismaService) {}

  async analyst(
    analystWhereUniqueInput: Prisma.AnalystWhereUniqueInput,
  ): Promise<Analyst | null> {
    return this.prisma.analyst.findUnique({
      where: analystWhereUniqueInput,
    });
  }
  async createAnalyst(data: Prisma.AnalystCreateInput): Promise<Analyst> {
    const userExist = await this.prisma.user.findUnique({
      where: { id: data.user.connect.id },
    });

    if (!userExist) {
      throw new Error('User does not exist');
    }

    const analystExist = await this.prisma.analyst.findUnique({
      where: { userId: data.user.connect.id },
    });

    if (analystExist) {
      throw new Error('Analyst already exists');
    }

    return this.prisma.analyst.create({
      data,
    });
  }

  async updateById(
    id: string,
    updateAnalystDto: UpdateAnalystDto,
  ): Promise<Analyst> {
    const existingAnalyst = await this.prisma.analyst.findUnique({
      where: { id },
    });

    if (!existingAnalyst) {
      throw new Error('Analyst not found');
    }

    try {
      const updatedAnalyst = await this.prisma.analyst.update({
        where: { id },
        data: updateAnalystDto,
      });
      return updatedAnalyst;
    } catch (error) {
      throw new Error(`Failed to update analyst: ${error.message}`);
    }
  }

  async removeById(id: string) {
    return this.prisma.analyst.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.analyst.findMany();
  }

  async findOneById(id: string) {
    return await this.prisma.analyst.findUnique({
      where: { id: id },
    });
  }
}
