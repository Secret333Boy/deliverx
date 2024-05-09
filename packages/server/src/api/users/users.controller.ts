import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserData } from './decorators/user-data.decorator';
import { User } from './entities/user.entity';
import { AdminGuard } from './guards/admin.guard';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { PatchWorkerDto } from './dto/patch-worker.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  public getUser(@UserData() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  public deleteUser(@UserData() user: User) {
    return this.usersService.delete(user.id);
  }

  @Get('/workers')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getWorkers(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.usersService.getWorkers(+take || 100, +skip || 0);
  }

  @Get('/workers/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getWorker(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getWorker(id);
  }

  @Post('/workers')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public createWorker(@Body() createWorkerDto: CreateWorkerDto) {
    return this.usersService.createWorker(createWorkerDto);
  }

  @Patch('/workers/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public patchWorker(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patchWorkerDto: PatchWorkerDto,
  ) {
    return this.usersService.patchWorker(id, patchWorkerDto);
  }

  @Delete('/workers/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public deleteWorker(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteWorker(id);
  }
}
