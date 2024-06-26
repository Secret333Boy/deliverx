import { Invoice } from './invoice.entity';
import { Transition } from './transition.entity';

export interface Journey {
  id: string;
  // vehicle?: Vehicle;
  transition: Transition;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  invoices?: Invoice[];
}
