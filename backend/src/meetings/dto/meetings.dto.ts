import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  analystId: string;
}

export class JoinMeetingDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class ValidateMeetingDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class SignalDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsEnum(['offer', 'answer', 'ice-candidate'])
  type: 'offer' | 'answer' | 'ice-candidate';

  signal: any;
}

export class EndMeetingDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}