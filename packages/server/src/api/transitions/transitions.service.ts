import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transition } from './entities/transition.entity';
import { DataSource, Repository } from 'typeorm';
import { PlacesService } from '../places/places.service';
import { PlaceType } from '../places/entities/place-type.enum';
import { Place } from '../places/entities/place.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

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

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async updateTransitions() {
    this.logger.log('Transitions update process started');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
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

          await queryRunner.manager.upsert(
            Transition,
            [
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
            ],
            ['sourcePlaceId', 'targetPlaceId'],
          );
        } else if (place1.type === PlaceType.SORT_CENTER) {
          for (const place2 of places) {
            if (place2.type !== PlaceType.SORT_CENTER || place1 === place2)
              continue;

            const length = Math.sqrt(
              (place1.lat - place2.lat) * (place1.lat - place2.lat) +
                (place1.lon - place2.lon) * (place1.lon - place2.lon),
            );

            await queryRunner.manager.upsert(
              Transition,
              {
                sourcePlace: { id: place1.id },
                targetPlace: { id: place2.id },
                cost: length,
              },
              ['sourcePlaceId', 'targetPlaceId'],
            );
          }
        }
      }

      this.logger.log('Transitions update process finished');
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  public getTransitionToTheClosestSortCenter(placeA: Place) {
    return this.transitionRepository.findOne({
      where: {
        sourcePlace: { id: placeA.id },
        targetPlace: { type: PlaceType.SORT_CENTER },
      },
      order: {
        cost: 'asc',
      },
      relations: ['sourcePlace', 'targetPlace'],
    });
  }

  public async getClosestSortCenter(department: Place) {
    const transition =
      await this.getTransitionToTheClosestSortCenter(department);
    if (!transition) return null;

    return transition.targetPlace;
  }

  public getTransitionBetween(placeA: Place, placeB: Place) {
    return this.transitionRepository.findOne({
      where: {
        sourcePlace: { id: placeA.id },
        targetPlace: { id: placeB.id },
      },
      order: {
        cost: 'asc',
      },
      relations: ['sourcePlace', 'targetPlace'],
    });
  }
}
