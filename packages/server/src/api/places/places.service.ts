import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';
import { PlaceType } from './entities/place-type.enum';

@Injectable()
export class PlacesService {
  private readonly PLACE_NOT_FOUND_EXCEPTION_MESSAGE = 'Place not found';
  private readonly DEPARTMENT_NOT_FOUND_EXCEPTION_MESSAGE =
    'Department not found';

  constructor(
    @InjectRepository(Place) private placeRepository: Repository<Place>,
  ) {}

  public getAllPlaces() {
    return this.placeRepository.find();
  }

  public async getPlaces(take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [places, count] = await this.placeRepository.findAndCount({
      take,
      skip,
    });

    const totalPages = Math.ceil(count / take);

    return { places, totalPages };
  }

  public async getPlace(id: number) {
    const place = await this.placeRepository.findOneBy({ id });

    if (!place)
      throw new NotFoundException(this.PLACE_NOT_FOUND_EXCEPTION_MESSAGE);

    return place;
  }

  public async getDepartments(take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [places, count] = await this.placeRepository.findAndCount({
      where: { type: PlaceType.DEPARTMENT },
      take,
      skip,
    });

    const totalPages = Math.ceil(count / take);

    return { places, totalPages };
  }

  public async getDepartment(id: number) {
    const place = await this.placeRepository.findOneBy({
      id,
      type: PlaceType.DEPARTMENT,
    });

    if (!place)
      throw new NotFoundException(this.DEPARTMENT_NOT_FOUND_EXCEPTION_MESSAGE);

    return place;
  }
}
