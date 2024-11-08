import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalystDto } from './create-analyst.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateAnalystDto extends PartialType(CreateAnalystDto) {

  @IsNotEmpty()
  @IsString()
  nikEmployee?: string; // NIK Employee is required

  @IsOptional()
  @IsString()
  position?: string; // Position can be optional

  @IsOptional()
  @IsString()
  superior?: string; // P
}
