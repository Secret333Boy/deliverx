import { Place } from 'src/api/places/entities/place.entity';
import { User } from 'src/api/users/entities/user.entity';
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

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

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

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn()
  currentPlace: Place;

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn()
  nextPlace: Place;

  @Column({ default: false })
  finished: boolean;
}
