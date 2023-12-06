import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlacesService {
  private readonly PLACE_NOT_FOUND_EXCEPTION_MESSAGE = 'Place not found';

  constructor(
    @InjectRepository(Place) private placeRepository: Repository<Place>,
  ) {}

  public async getPlace(id: number) {
    const place = await this.placeRepository.findOneBy({ id });

    if (!place)
      throw new NotFoundException(this.PLACE_NOT_FOUND_EXCEPTION_MESSAGE);

    return place;
  }
}
