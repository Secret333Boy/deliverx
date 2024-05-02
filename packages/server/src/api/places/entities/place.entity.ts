import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PlaceType } from './place-type.enum';
import { Vehicle } from 'src/api/vehicles/entities/vehicle.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column('enum', { enum: PlaceType })
  type: PlaceType;

  @Column()
  lon: number;

  @Column()
  lat: number;

  @JoinColumn()
  attachedVehicles: Vehicle[];
}
