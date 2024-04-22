import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}

  public async getRandomVehicle(sortCenterId: number) {
    const vehicles = await this.vehicleRepository.findBy({
      attachedSortCenter: { id: sortCenterId },
    });
    if (vehicles.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * vehicles.length);

    return vehicles[randomIndex];
  }
}
