import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transition } from './entities/transition.entity';
import { DataSource, Repository } from 'typeorm';
import { PlacesService } from '../places/places.service';
import { PlaceType } from '../places/entities/place-type.enum';
import { Place } from '../places/entities/place.entity';

@Injectable()
export class TransitionsService {
  private readonly logger = new Logger(TransitionsService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Transition)
    private transitionRepository: Repository<Transition>,
    @Inject(PlacesService) private placesService: PlacesService,
  ) {
    this.updateTransitions();
  }

  public getAllTransitions() {
    return this.transitionRepository.find();
  }

  public async updateTransitions() {
    this.logger.log('Transtions update process started');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Transition, {});

      const places = await this.placesService.getAllPlaces();

      for (const place1 of places) {
        if (place1.type === PlaceType.DEPARTMENT) {
          let closest: { place?: Place; length: number } = {
            place: undefined,
            length: Infinity,
          };
          for (const place2 of places) {
            if (place2.type !== PlaceType.SORT_CENTER) continue;

            const length = Math.sqrt(
              (place1.lat - place2.lat) * (place1.lat - place2.lat) +
                (place1.lon - place2.lon) * (place1.lon - place2.lon),
            );

            if (length < closest.length) {
              closest = { place: place2, length };
            }
          }

          if (!closest.place) continue;

          await queryRunner.manager.save(Transition, [
            {
              sourcePlace: { id: place1.id },
              targetPlace: { id: closest.place.id },
              cost: closest.length,
            },
            {
              sourcePlace: { id: closest.place.id },
              targetPlace: { id: place1.id },
              cost: closest.length,
            },
          ]);
        } else if (place1.type === PlaceType.SORT_CENTER) {
          for (const place2 of places) {
            if (place2.type !== PlaceType.SORT_CENTER || place1 === place2)
              continue;

            const length = Math.sqrt(
              (place1.lat - place2.lat) * (place1.lat - place2.lat) +
                (place1.lon - place2.lon) * (place1.lon - place2.lon),
            );

            await queryRunner.manager.save(Transition, {
              sourcePlace: { id: place1.id },
              targetPlace: { id: place2.id },
              cost: length,
            });
          }
        }
      }

      this.logger.log('Transtions update process finished');
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
