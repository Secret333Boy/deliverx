import { Place } from '../places/entities/place.entity';
import { Transition } from '../transitions/entities/transition.entity';

export interface PathFinder {
  findPath(placeA: Place, placeB: Place, transitions: Transition[]): Place[];
}
