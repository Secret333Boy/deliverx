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
    const links: Record<number, { targetId: number; cost: number }[]> = {};

    for (const transition of transitions) {
      const sourceId = transition.sourcePlace.id;
      const targetId = transition.targetPlace.id;
      const cost = transition.cost;

      if (links[sourceId]) {
        links[sourceId].push({ targetId, cost });
        continue;
      }

      links[sourceId] = [{ targetId, cost }];
    }

    const placeAId = placeA.id;
    const placeBId = placeA.id;

    return [];
  }
}
