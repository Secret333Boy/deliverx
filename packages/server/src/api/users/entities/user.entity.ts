import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';

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
}
