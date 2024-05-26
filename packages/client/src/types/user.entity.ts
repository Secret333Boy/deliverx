import { Place } from './place.entity';
import { Role } from './role.enum';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  place?: Place;
}
