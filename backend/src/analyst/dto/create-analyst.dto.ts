import { IsString, IsOptional, IsNotEmpty, isString } from 'class-validator';

export class CreateAnalystDto {
  @IsNotEmpty()
  @IsString()
  nikEmployee: string; // NIK Employee is required

  @IsOptional()
  @IsString()
  position: string; // Position can be optional

  @IsOptional()
  @IsString()
  superior?: string; // Position can be optional
}
