import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    @Inject(VehiclesService) private vehiclesService: VehiclesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async getAllVehicles(
    @Query('take', new DefaultValuePipe(100), new ParseIntPipe())
    take: number,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe())
    skip: number,
  ) {
    return this.vehiclesService.getAllVehicles(take, skip);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async getVehicles(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.getVehicle(id);
  }

  @Get('/inplace/:placeId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async getInplaceVehicles(
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Query('take', new DefaultValuePipe(100), new ParseIntPipe())
    take: number,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe())
    skip: number,
  ) {
    return this.vehiclesService.getInplaceVehicles(placeId, take, skip);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(createVehicleDto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async updateVehicle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicle(id, updateVehicleDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async deleteVehicle(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.deleteVehicle(id);
  }
}
