import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('select-all')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  //create a new user
  @Post('create')
  async createUser(@Body() data: any) {
    return this.usersService.createUser(data);
  }

  //delete a user
  @Post('delete')
  async deleteUser(@Body() data: { id: string }) {
    return this.usersService.deleteUser(data);
  }

  @Get(':id')
  async getUserbyId(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }
}
