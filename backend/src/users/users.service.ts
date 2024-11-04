import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // check if user already exists
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      throw new Error('User already exists');
    }
    // hash password
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data,
    });
  }

  //select all users
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  //find one user by email
  async findOneByEmail(email: String) {
    return await this.prisma.user.findUnique({
      where: { email: String(email) },
      include: {
        company: true,
        analyst: true,
        admin: true,
      },
    });
  }

  //find one user by id
  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        company: true,
        analyst: true,
        admin: true,
      },
    });
  }

  //delete user
  async deleteUser(data: { id: string }) {
    await this.prisma.user.delete({
      where: { id: data.id },
    });

    if (await this.findOneById(data.id)) {
      return {
        message: 'User not deleted',
      };
    } else {
      return {
        message: 'User deleted',
      };
    }
  }
}
