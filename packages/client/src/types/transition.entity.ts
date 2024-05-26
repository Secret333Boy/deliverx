import { Place } from './place.entity';

export interface Transition {
  id: string;
  sourcePlace: Place;
  targetPlace: Place;
  cost: number;
}
