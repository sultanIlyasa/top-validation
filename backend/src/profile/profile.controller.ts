import {
  Controller,
  Put,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateProfileDto } from './dto/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  async updateProfile(
    @Param('id') id: string,
    @Body() UpdateProfileDto: UpdateProfileDto,
    @UploadedFile() profilePic?: Express.Multer.File,
  ) {
    
    return await this.profileService.updateProfileById(
      id,
      UpdateProfileDto,
      profilePic,
    );
  }
}
