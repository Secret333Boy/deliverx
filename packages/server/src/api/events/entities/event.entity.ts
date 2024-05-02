import { Invoice } from 'src/api/invoices/entities/invoice.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventType } from './event-type.enum';
import { Journey } from 'src/api/journeys/entities/journey.entity';

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

  @ManyToOne(() => Journey, (journey) => journey.id, {
    nullable: true,
  })
  @JoinColumn()
  journey?: Journey;

  @Column({ default: false })
  processed: boolean;

  @Column({ default: false })
  failed: boolean;
}
