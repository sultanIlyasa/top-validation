import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string; // Company name is required

  @IsOptional()
  @IsString()
  positions?: string; // Positions can be optional

  @IsOptional()
  address?: {
    companyAddress?: string;
    province?: string;
    district?: string;
    city?: string;
    region?: string;
    postcode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}
