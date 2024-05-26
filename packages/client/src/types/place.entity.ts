import { PlaceType } from './place-type.enum';

export interface Place {
  id: string;
  name: string;
  description: string;
  type: PlaceType;
  lon: number;
  lat: number;
}
