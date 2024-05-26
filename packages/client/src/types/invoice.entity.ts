import { Place } from './place.entity';
import { User } from './user.entity';

export interface Invoice {
  id: string;
  creator?: User;
  description: string;
  senderDepartment: Place;
  senderFullName: string;
  receiverDepartment: Place;
  receiverFullName: string;
  receiverEmail: string;
  fragile: boolean;
  currentPlace?: Place;
  isFinished: boolean;
  isInJourney: boolean;
  // journey?: Journey;
}
