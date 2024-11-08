import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async company(
    companyWhereUniqueInput: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: companyWhereUniqueInput,
    });
  }

  async createCompany(data: Prisma.CompanyCreateInput): Promise<Company> {
    const userExist = await this.prisma.user.findUnique({
      where: { id: data.user.connect.id },
    });

    if (!userExist) {
      throw new Error('User does not exist');
    }

    const companyExist = await this.prisma.company.findUnique({
      where: { userId: data.user.connect.id },
    });

    if (companyExist) {
      throw new Error('Company already exists');
    }

    return this.prisma.company.create({
      data,
    });
  }

  async updateById(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    // Check if the company exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new Error('Company not found');
    }

    // Update the company with new data
    try {
      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: {
          ...updateCompanyDto,
          // Ensure we only update fields present in the DTO
          companyName: updateCompanyDto.companyName,
          positions: updateCompanyDto.positions,
          address: updateCompanyDto.address
            ? {
                update: updateCompanyDto.address,
              }
            : undefined,
        },
      });

      return updatedCompany;
    } catch (error) {
      throw new Error(`Failed to update company: ${error.message}`);
    }
  }

  async removeById(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.company.findMany();
  }

  async findOneById(id: string) {
    return await this.prisma.company.findUnique({
      where: { id: id },
    });
  }
}
