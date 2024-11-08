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
} from '@nestjs/common';
import { AnalystService } from './analyst.service';
import { CreateAnalystDto } from './dto/create-analyst.dto';
import { UpdateAnalystDto } from './dto/update-analyst.dto';

@Controller('analyst')
export class AnalystController {
  constructor(private readonly analystService: AnalystService) {}

  @Post('create/:userId')
  async createAnalyst(
    @Param('userId') userId: string,
    @Body() createAnalystDto: CreateAnalystDto,
  ) {
    try {
      const newAnalyst = await this.analystService.createAnalyst({
        ...createAnalystDto,
        user: { connect: { id: userId } },
      });
      return newAnalyst;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.analystService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analystService.findOneById(id);
  }

  @Patch(':id')
  async updateCompanyById(
    @Param('id') id: string,
    @Body() updateAnalystDto: UpdateAnalystDto,
  ) {
    try {
      const updatedCompany = await this.analystService.updateById(
        id,
        updateAnalystDto,
      );
      return updatedCompany;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.analystService.removeById(id);
      return { message: 'Analyst removed successfully' };
    } catch (error) {}
  }
}
