import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

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

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    try {
      if (
        resetPasswordDto.password !== resetPasswordDto.confirmPassword
      ) {
        throw new Error('Passwords do not match');
      }

      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user) {
      return { message: 'If an account with that email exists, a reset link was sent.' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); 

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: expires
      }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // await this.sendResetEmail(user.email, user.firstName, resetLink);
    return this.sendResetEmail(user.email, user.firstName, resetLink);

    // return { message: 'If an account with that email exists, a reset link was sent.' };
  }

  async resetPasswordWithToken(token: string, resetPasswordDto: ResetPasswordDto) {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    const user = await this.prisma.user.findUnique({ where: { id: record.userId }});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({ where: { token }});

    return { message: 'Password reset successfully' };
  }

  async sendResetEmail(to: string, name: string, link: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="text-align:center;">
          <img src="https://your-cdn.com/header.png" alt="Header Image" width="600" />
        </div>
        <h3>Hello, ${name}</h3>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${link}" style="color: #00CA87; text-decoration:none;">Reset Your Password</a></p>
        <p>The link will expire in 24 hours.</p>
        <div style="text-align:center;">
          <img src="https://your-cdn.com/footer.png" alt="Footer Image" width="600" />
        </div>
      </body>
    </html>
    `;

    return html;
    // await transporter.sendMail({
    //   from: '"Bixbox CS" <no-reply@bixbox.com>',
    //   to,
    //   subject: "Forgot Password",
    //   html,
    // });
  }
}
