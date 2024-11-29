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

  @Put('update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  async updateProfile(
    @Param('id') id: string,
    @Body() UpdateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfileById(id, UpdateProfileDto);
  }

  @Put('img/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  async uploadToImgBB(
    @Param('id') id: string,
    @Body() UpdateProfileDto: UpdateProfileDto,
    @UploadedFile() profilePic: Express.Multer.File,
  ) {
    return await this.profileService.uploadToImgBB(
      id,
      profilePic,
      UpdateProfileDto,
    );
  }
}
