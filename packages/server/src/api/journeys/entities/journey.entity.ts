import { Invoice } from 'src/api/invoices/entities/invoice.entity';
import { Transition } from 'src/api/transitions/entities/transition.entity';
import { Vehicle } from 'src/api/vehicles/entities/vehicle.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Journey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn()
  vehicle: Vehicle;

  @ManyToOne(() => Transition, { onDelete: 'CASCADE' })
  @JoinColumn()
  transition: Transition;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  endedAt?: Date;

  @JoinColumn()
  invoices: Invoice[];
}
