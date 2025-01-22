import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateProfileDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString({ message: 'Profile picture URL must be a string' })
  @IsOptional() // Add this decorator to make it optional
  profpicUrl?: string | null; // Add null as a possible type

  company?: {
    companyName?: string;
    positions?: string;
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
  };

  analyst?: {
    nikEmployee: string;
    position?: string;
    superior?: string;
  };
}
