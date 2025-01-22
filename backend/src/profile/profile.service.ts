import { Injectable, BadRequestException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { AnalystService } from 'src/analyst/analyst.service';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import * as FormData from 'form-data';
import { promises } from 'dns';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private companyService: CompanyService,
    private analystService: AnalystService,
  ) {}

  async uploadToImgBB(
    id: string,
    file: Express.Multer.File,
    updateData: UpdateProfileDto,
  ): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        company: { include: { address: true } },
        analyst: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    try {
      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );
      let profpicURL = updateData.profpicUrl;
      if (response.data.data.url) {
        profpicURL = response.data.data.url;
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          profpicUrl: profpicURL,
        },
      });
      return updatedUser.profpicUrl;
    } catch (error) {
      throw new BadRequestException('Image upload failed');
    }
  }

  async updateProfileById(id: string, updateData: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        company: { include: { address: true } },
        analyst: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    let addressData = updateData.company?.address;
    if (typeof addressData === 'string') {
      try {
        addressData = JSON.parse(addressData);
      } catch (error) {
        throw new BadRequestException('Invalid address format');
      }
    }

    return await this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          profpicUrl: updateData.profpicUrl,
        },
      });

      let updatedCompany;
      if (user.role === 'COMPANY' && updateData.company) {
        if (!user.company) {
          // Create company if it does not exist
          updatedCompany = await this.companyService.createCompany({
            user: { connect: { id: user.id } },
            companyName: updateData.company.companyName,
            positions: updateData.company.positions,
            address: updateData.company.address
              ? { create: updateData.company.address }
              : undefined,
          });
        } else {
          // Update existing company
          updatedCompany = await this.companyService.updateById(
            user.company.id,
            updateData.company,
          );
        }

        return {
          ...updatedUser,
          company: updatedCompany,
          address: addressData,
        };
      } else if (user.role === 'ANALYST' && updateData.analyst) {
        let updatedAnalyst;
        if (!user.analyst) {
          console.log('create analyst');
          updatedAnalyst = await this.analystService.createAnalyst({
            user: { connect: { id: user.id } },
            ...updateData.analyst,
          });
        } else {
          console.log('update analyst');
          updatedAnalyst = await prisma.analyst.update({
            where: { id: user.analyst.id },
            data: updateData.analyst,
          });
        }
        console.log('updated analyst', updatedAnalyst);

        return {
          ...updatedUser,
          analyst: updatedAnalyst,
        };
      }

      return updatedUser;
    });
  }
}
