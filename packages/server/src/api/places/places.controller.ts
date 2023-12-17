import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(@Inject(PlacesService) private placesService: PlacesService) {}

  @Get('/departments')
  public getDepartments(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.placesService.getDepartments(+take || 100, +skip || 0);
  }
}
