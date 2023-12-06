import { Place } from 'src/api/places/entities/place.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn()
  sourcePlace: Place;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn()
  targetPlace: Place;

  @Column()
  cost: number;
}
