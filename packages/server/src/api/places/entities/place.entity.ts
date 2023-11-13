import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PlaceType } from './place-type.enum';

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('enum', { enum: PlaceType })
  type: PlaceType;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column()
  lon: number;

  @Column()
  lat: number;
}
