import { Place } from 'src/api/places/entities/place.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['sourcePlaceId', 'targetPlace'])
export class Transition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Place, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  sourcePlace: Place;

  @ManyToOne(() => Place, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  targetPlace: Place;

  @Column('float')
  cost: number;

  @Column()
  sourcePlaceId: string;

  @Column()
  targetPlaceId: string;
}
