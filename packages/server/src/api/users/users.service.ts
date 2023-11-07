import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UserReponseDto } from './dto/user-reponse.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { PatchWorkerDto } from './dto/patch-worker.dto';

@Injectable()
export class UsersService {
  private readonly USER_NOT_FOUND_EXCEPTION_MESSAGE = 'User not found';
  private readonly WORKER_NOT_FOUND_EXCEPTION_MESSAGE = 'Worker not found';
  private readonly WORKER_ALREADY_EXISTS_MESSAGE =
    'Worker with this email already exists';

  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    this.initRootAdminAccount();
  }

  public async initRootAdminAccount() {
    try {
      const hash = bcrypt.hashSync(
        process.env.ROOT_ADMIN_PASSWORD || 'admin',
        bcrypt.genSaltSync(),
      );

      await this.usersRepository.upsert(
        {
          id: '00000000-00000000-00000000-00000000',
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
    });

    const totalPages = Math.ceil(count / take);

    return { totalPages, workers };
  }

  public async getWorker(id: string) {
    const worker = await this.usersRepository.findOneBy({
      id,
      role: Not(Role.USER),
    });

    if (!worker)
      throw new NotFoundException(this.WORKER_NOT_FOUND_EXCEPTION_MESSAGE);

    return worker;
  }

  public async createWorker(createWorkerDto: CreateWorkerDto) {
    const workerInDb = await this.usersRepository.findOneBy({
      email: createWorkerDto.email,
      role: Not(Role.USER),
    });

    if (workerInDb)
      throw new ConflictException(this.WORKER_ALREADY_EXISTS_MESSAGE);

    const { password, ...workerData } = createWorkerDto;

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    return this.create({ ...workerData, hash });
  }

  public async patchWorker(id: string, patchWorkerDto: PatchWorkerDto) {
    const worker = await this.getWorker(id);

    const { password, ...workerData } = patchWorkerDto;

    const hash = password
      ? bcrypt.hashSync(password, bcrypt.genSaltSync())
      : worker.hash;

    await this.usersRepository.save({ ...worker, ...workerData, hash });
  }

  public async deleteWorker(id: string) {
    await this.getWorker(id);

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

  public findOneByPartial(user: Partial<User>) {
    return this.usersRepository.findOneBy(user);
  }

  public async delete(id: string) {
    await this.findOne(id);

    await this.usersRepository.delete({ id });
  }
}
