import { IsEmail, isString, IsString, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  profpicUrl?: string;

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
