import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Place } from 'src/api/places/entities/place.entity';
import { Invoice } from 'src/api/invoices/entities/invoice.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('enum', { enum: Role })
  role: Role;

  @ManyToOne(() => Place, (place) => place.id, { nullable: true })
  @JoinColumn()
  place?: Place;

  @ManyToMany(() => Invoice)
  @JoinTable({ name: 'user_invoice' })
  trackedInvoices: Invoice[];
}
