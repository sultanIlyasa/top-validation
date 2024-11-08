import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create/:userId')
  async createCompany(
    @Param('userId') userId: string,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    try {
      const newCompany = await this.companyService.createCompany({
        ...createCompanyDto,
        user: { connect: { id: userId } },
        address: createCompanyDto.address
          ? { create: createCompanyDto.address }
          : undefined,
      });
      return newCompany;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOneById(id);
  }

  @Put(':id')
  async updateCompanyById(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const updatedCompany = await this.companyService.updateById(
        id,
        updateCompanyDto,
      );
      return updatedCompany;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.companyService.removeById(id);
      return { message: 'Company removed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
