import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserData } from './decorators/user-data.decorator';
import { User } from './entities/user.entity';
import { UserGuard } from './guards/user.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, UserGuard)
  public getUser(@UserData() user: User) {
    return this.usersService.findOne(user.id);
  }
}
