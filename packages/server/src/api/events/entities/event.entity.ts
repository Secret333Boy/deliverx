import { Invoice } from 'src/api/invoices/entities/invoice.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventType } from './event-type.enum';
import { Transition } from 'src/api/transitions/entities/transition.entity';
import { Place } from 'src/api/places/entities/place.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, { onDelete: 'CASCADE' })
  @JoinColumn()
  invoice: Invoice;

  @Column('enum', { enum: EventType })
  type: EventType;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn()
  source?: Place;

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn()
  target?: Place;

  @Column({ default: false })
  processed: boolean;

  @Column({ default: false })
  failed: boolean;
}
