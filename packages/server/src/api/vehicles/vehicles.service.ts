import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../users/entities/role.enum';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}

  public async getAllVehicles(take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [vehicles, count] = await this.vehicleRepository.findAndCount({
      take,
      skip,
      relations: ['driver', 'attachedSortCenter'],
    });

    const totalPages = Math.ceil(count / take);

    return { data: vehicles, totalPages };
  }

  public async getInplaceVehicles(placeId: string, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [vehicles, count] = await this.vehicleRepository.findAndCount({
      where: {
        attachedSortCenter: { id: placeId },
      },
      take,
      skip,
      relations: ['driver', 'attachedSortCenter'],
    });

    const totalPages = Math.ceil(count / take);

    return { data: vehicles, totalPages };
  }

  public async getVehicle(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['driver', 'attachedSortCenter'],
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    return vehicle;
  }

  public async createVehicle(createVehicleDto: CreateVehicleDto) {
    const { driverId, attachedSortCenterId, ...vehicleData } = createVehicleDto;

    const driver = await this.usersService.getWorker(driverId);

    if (driver.role !== Role.DRIVER)
      throw new BadRequestException('Worker is not a driver');

    if (!driver.place)
      throw new BadRequestException("Worker does't have a working place");

    const driverPart = driverId ? { driver: { id: driverId } } : {};

    const attachedSortCenterPart = attachedSortCenterId
      ? { attachedSortCenter: { id: attachedSortCenterId } }
      : { attachedSortCenter: { id: driver.place.id } };

    return this.vehicleRepository.save({
      ...driverPart,
      ...attachedSortCenterPart,
      ...vehicleData,
    });
  }

  public async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.getVehicle(id);

    const { driverId, attachedSortCenterId, ...vehicleData } = updateVehicleDto;

    const driverPart: { driver?: { id: string } } = {};
    const attachedSortCenterPart: { attachedSortCenter?: { id: string } } = {};

    if (driverId) {
      const driver = await this.usersService.getWorker(driverId);

      if (driver.role !== Role.DRIVER)
        throw new BadRequestException('Worker is not a driver');

      if (!driver.place)
        throw new BadRequestException("Worker does't have a working place");

      driverPart.driver = { id: driverId };

      attachedSortCenterPart.attachedSortCenter = attachedSortCenterId
        ? { id: attachedSortCenterId }
        : { id: driver.place.id };
    }

    await this.vehicleRepository.save({
      id: vehicle.id,
      ...driverPart,
      ...attachedSortCenterPart,
      ...vehicleData,
    });
  }

  public async deleteVehicle(id: string) {
    const vehicle = await this.getVehicle(id);

    await vehicle.remove();
  }

  public async getRandomAttachedVehicle(sortCenterId: string) {
    const vehicles = await this.vehicleRepository.findBy({
      attachedSortCenter: { id: sortCenterId },
      driverId: Not(IsNull()),
    });

    if (vehicles.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * vehicles.length);

    return vehicles[randomIndex];
  }
}
