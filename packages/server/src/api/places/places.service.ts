import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';
import { PlaceType } from './entities/place-type.enum';

@Injectable()
export class PlacesService {
  private readonly PLACE_NOT_FOUND_EXCEPTION_MESSAGE = 'Place not found';

  constructor(
    @InjectRepository(Place) private placeRepository: Repository<Place>,
  ) {}

  public getAllPlaces() {
    return this.placeRepository.find();
  }

  public async getPlace(id: number) {
    const place = await this.placeRepository.findOneBy({ id });

    if (!place)
      throw new NotFoundException(this.PLACE_NOT_FOUND_EXCEPTION_MESSAGE);

    return place;
  }

  public getDepartments(take = 100, skip = 0) {
    if (take > 100) take = 100;

    return this.placeRepository.find({
      where: { type: PlaceType.DEPARTMENT },
      take,
      skip,
    });
  }
}
