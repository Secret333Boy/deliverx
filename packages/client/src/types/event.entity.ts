import { EventType } from './event-type.enum';
import { Journey } from './journey.entity';

export interface Event {
  id: string;
  // invoice: Invoice;
  type: EventType;
  time: string;
  journey?: Journey;
  processed: boolean;
  failed: boolean;
}
