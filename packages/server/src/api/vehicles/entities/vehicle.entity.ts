import { Place } from 'src/api/places/entities/place.entity';
import { User } from 'src/api/users/entities/user.entity';
import {
  BaseEntity,
  Column,
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

  @OneToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  driver: User;

  @ManyToOne(() => Place, (place) => place.id)
  attachedSortCenter?: Place;

  @Column({ nullable: true })
  driverId?: string;

  @Column({ nullable: true })
  attachedSortCenterId?: string;
}
