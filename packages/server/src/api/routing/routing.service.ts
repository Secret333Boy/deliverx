import { Inject, Injectable } from '@nestjs/common';
import { Place } from '../places/entities/place.entity';
import { PathFinder } from './path-finder.interface';
import { AStarPathFinder } from './a-star-path-finder';
import { TransitionsService } from '../transitions/transitions.service';

@Injectable()
export class RoutingService {
  constructor(
    @Inject(TransitionsService) private transitionsService: TransitionsService,
    @Inject(AStarPathFinder) private pathFinder: PathFinder,
  ) {}

  public async findRoute(placeA: Place, placeB: Place) {
    const transitions = await this.transitionsService.getAllTransitions();

    return this.pathFinder.findPath(placeA, placeB, transitions);
  }
}
