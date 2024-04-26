import { Place } from 'src/api/places/entities/place.entity';
import { User } from 'src/api/users/entities/user.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  driver: User;

  @ManyToOne(() => Place, (place) => place.id)
  attachedSortCenter?: Place;
}
