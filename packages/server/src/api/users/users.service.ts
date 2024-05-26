import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UserReponseDto } from './dto/user-reponse.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { PatchWorkerDto } from './dto/patch-worker.dto';
import { Place } from '../places/entities/place.entity';
import { PlacesService } from '../places/places.service';

@Injectable()
export class UsersService {
  private readonly USER_NOT_FOUND_EXCEPTION_MESSAGE = 'User not found';
  private readonly WORKER_NOT_FOUND_EXCEPTION_MESSAGE = 'Worker not found';
  private readonly USER_ALREADY_EXISTS_CONFLICT_EXCEPTION_MESSAGE =
    'User with this email already exists';

  private readonly MAIN_ADMIN_UUID = '00000000-0000-0000-0000-000000000000';

  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(PlacesService) private placesService: PlacesService,
  ) {
    this.initRootAdminAccount();
  }

  public async initRootAdminAccount() {
    try {
      const adminPassword = process.env.ROOT_ADMIN_PASSWORD || 'adminadmin';

      if (adminPassword.length < 8)
        throw new Error('Root admin password length is less than 8');

      const hash = bcrypt.hashSync(adminPassword, bcrypt.genSaltSync());

      await this.usersRepository.upsert(
        {
          id: this.MAIN_ADMIN_UUID,
          email: 'deliverx.admin@gmail.com',
          hash,
          firstName: 'admin',
          lastName: 'admin',
          role: Role.ADMIN,
        },
        ['email'],
      );

      this.logger.log('Succesfully initiated root admin account');
    } catch (e) {
      this.logger.fatal('Failed to init root admin account', e);
    }
  }

  public create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  public async getWorkers(take: number, skip: number) {
    if (take > 100) take = 100;

    const [workers, count] = await this.usersRepository.findAndCount({
      where: {
        role: Not(Role.USER),
      },
      take,
      skip,
      relations: ['place'],
    });

    const totalPages = Math.ceil(count / take);

    workers.forEach((worker) => delete worker.hash);

    return { workers, totalPages };
  }

  public async getWorker(id: string) {
    const worker = await this.usersRepository.findOne({
      where: { id, role: Not(Role.USER) },
      relations: ['place'],
    });

    if (!worker)
      throw new NotFoundException(this.WORKER_NOT_FOUND_EXCEPTION_MESSAGE);

    delete worker.hash;

    return worker;
  }

  public async createWorker(createWorkerDto: CreateWorkerDto) {
    const { placeId, password, ...workerData } = createWorkerDto;

    const workerInDb = await this.usersRepository.findOneBy({
      email: createWorkerDto.email,
    });

    if (workerInDb)
      throw new ConflictException(
        this.USER_ALREADY_EXISTS_CONFLICT_EXCEPTION_MESSAGE,
      );

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    const place = placeId
      ? await this.placesService.getPlace(placeId)
      : undefined;

    await this.usersRepository.save({
      ...workerData,
      hash,
      ...(place ? { place: { id: place.id } } : {}),
    });
  }

  public async patchWorker(id: string, patchWorkerDto: PatchWorkerDto) {
    const worker = await this.getWorker(id);

    if (
      worker.id === this.MAIN_ADMIN_UUID &&
      patchWorkerDto.role &&
      patchWorkerDto.role !== Role.ADMIN
    )
      throw new BadRequestException('Tried to patch main admin account role');

    const { password, placeId, ...workerData } = patchWorkerDto;

    const hash = password
      ? bcrypt.hashSync(password, bcrypt.genSaltSync())
      : worker.hash;

    const place = placeId
      ? await this.placesService.getPlace(placeId)
      : undefined;

    await this.usersRepository.save({
      ...worker,
      ...workerData,
      hash,
      ...(place ? { place: { id: place.id } } : {}),
    });
  }

  public async deleteWorker(id: string) {
    const worker = await this.getWorker(id);

    if (worker.id === this.MAIN_ADMIN_UUID)
      throw new BadRequestException('Tried to delete main admin account');

    await this.delete(id);
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    await this.usersRepository.save({ id, ...updateUserDto });
  }

  public async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user)
      throw new NotFoundException(this.USER_NOT_FOUND_EXCEPTION_MESSAGE);

    return new UserReponseDto(user);
  }

  public findOneByPartial(user: FindOptionsWhere<User>) {
    return this.usersRepository.findOneBy(user);
  }

  public async delete(id: string) {
    await this.findOne(id);

    await this.usersRepository.delete({ id });
  }
  public async getWorkerPlace(id: string): Promise<Place | null> {
    const { place } = await this.usersRepository.findOne({
      where: { id },
      relations: ['place'],
    });

    return place;
  }

  public async getBulkUsers(ids: string[]) {
    const users = await this.usersRepository.findBy({ id: In(ids) });

    users.forEach((user) => delete user.hash);

    return users;
  }
}
