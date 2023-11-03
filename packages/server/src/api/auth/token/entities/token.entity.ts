import { User } from 'src/api/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TokenStore {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  public user: User;

  @Column()
  public token: string;
}
