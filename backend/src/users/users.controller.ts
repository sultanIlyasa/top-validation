import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('api/select-all')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  //create a new user
  @Post('create')
  async createUser(@Body() data: any) {
    return this.usersService.createUser(data);
  }

  @Post('create-many')
  async createManyUsers(@Body() data: any) {
    return this.usersService.createManyUsers(data);
  }

  //delete a user
  @Post('delete')
  async deleteUser(@Body() data: { id: string }) {
    return this.usersService.deleteUser(data);
  }

  @UseGuards(AuthGuard) // 👈 Add this decorator to the route handler for protecting API
  @Get(':id')
  async getUserbyId(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(AuthGuard) // 👈 Add this decorator to the route handler for protecting API
  @Get('dashboard/:id')
  async getUserDashboard(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }
}
