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

  @Column()
  startTime: Date;

  @ManyToMany(() => Invoice)
  @JoinTable()
  invoices: Invoice[];
}
