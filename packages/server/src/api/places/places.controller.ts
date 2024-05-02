import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { CreatePlaceDto } from './dto/create-place.dto';
import { PatchPlaceDto } from './dto/patch-place.dto';

@Controller('places')
export class PlacesController {
  constructor(@Inject(PlacesService) private placesService: PlacesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getPlaces(@Query('take') take?: string, @Query('skip') skip?: string) {
    return this.placesService.getPlaces(+take || 100, +skip || 0);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  public createPlace(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.createPlace(createPlaceDto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public patchPlace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patchPlaceDto: PatchPlaceDto,
  ) {
    return this.placesService.patchPlace(id, patchPlaceDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public deletePlace(@Param('id', ParseUUIDPipe) id: string) {
    return this.placesService.deletePlace(id);
  }

  @Get('/departments')
  public getDepartments(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.placesService.getDepartments(+take || 100, +skip || 0);
  }
}
