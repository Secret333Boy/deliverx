import { Place } from 'src/api/places/entities/place.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToOne(() => Place)
  @JoinColumn()
  senderDepartment: Place;

  @Column()
  senderFullName: string;

  @ManyToOne(() => Place)
  @JoinColumn()
  receiverDepartment: Place;

  @Column()
  receiverFullName: string;

  @Column()
  receiverEmail: string;

  @Column({ default: false })
  fragile: boolean;
}
