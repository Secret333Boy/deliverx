import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place) private placeRepository: Repository<Place>,
  ) {}

  public getPlace(id: string) {
    return this.placeRepository.findOneBy({ id });
  }
}
