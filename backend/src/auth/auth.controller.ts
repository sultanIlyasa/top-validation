import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RefreshJwtGuard } from './guard/refresh.guard';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout/:id')
  async logout(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // First, call the existing logout service method
    await this.authService.logout(id);

    // Then clear the cookies
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: process.env.COOKIE_DOMAIN, // Your domain
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: process.env.COOKIE_DOMAIN, // Your domain
    });

    // Clear any other session-related cookies
    res.clearCookie('next-auth.session-token');
    res.clearCookie('next-auth.callback-url');
    res.clearCookie('next-auth.csrf-token');

    return { message: 'Logged out successfully' };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(AuthGuard)
  @Post('reset-password')
  async resetPassword(
    @Request() req, 
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(req.user.sub, resetPasswordDto);
  }
}
