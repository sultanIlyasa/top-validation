import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength, Matches } from 'class-validator';
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEnum(Role)
  role: Role;
}
