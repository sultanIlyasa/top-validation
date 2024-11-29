import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

const EXPIRE_TIME = 20 * 1000; // 20 seconds in milliseconds
const expirationDate = new Date();
expirationDate.setTime(new Date().getTime() + EXPIRE_TIME);

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async logout(id: string) {
    // First, set the refresh token to a temporary value to test
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: 'temporary_value' },
    });

    // Now, set the refresh token to null
    const user = await this.prisma.user.update({
      where: { id },
      data: { refreshToken: null },
    });

    if (user.refreshToken === null) {
      return { message: 'User logged out' };
    } else {
      return { message: 'Error logging out' };
    }
  }

  async login(dto: LoginDto) {
    // find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        company: true,
        analyst: true,
        admin: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials not found');

    // check password
    // hash password 10 cost factor
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid Password');

    // generate token
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        // Include role-specific data
        ...(user.company && { company: user.company }),
        ...(user.analyst && { analyst: user.analyst }),
        ...(user.admin && { admin: user.admin }),
      },
      backendTokens: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expiresIn: expirationDate,
      },
    };
  }

  async getTokens(userId: string, email: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '10h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: any) {
    const payload = {
      userId: user.id,
      sub: user.sub,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '20s',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
      expiresIn: expirationDate,
    };
  }
}
