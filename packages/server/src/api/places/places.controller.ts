import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../users/guards/admin.guard';

@Controller('places')
export class PlacesController {
  constructor(@Inject(PlacesService) private placesService: PlacesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getPlaces(@Query('take') take?: string, @Query('skip') skip?: string) {
    return this.placesService.getPlaces(+take || 100, +skip || 0);
  }

  @Get('/departments')
  public getDepartments(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.placesService.getDepartments(+take || 100, +skip || 0);
  }
}
