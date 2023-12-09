import { Injectable } from '@nestjs/common';
import { Place } from '../places/entities/place.entity';
import { Transition } from '../transitions/entities/transition.entity';
import { PathFinder } from './path-finder.interface';

@Injectable()
export class AStarPathFinder implements PathFinder {
  public findPath(
    placeA: Place,
    placeB: Place,
    transitions: Transition[],
  ): Place[] {
    return [];
  }
}
