import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Place } from 'src/api/places/entities/place.entity';

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

  @OneToOne(() => Place, { nullable: true })
  @JoinColumn()
  place?: Place;
}
