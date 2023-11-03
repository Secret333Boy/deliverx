import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserReponseDto from './dto/user-reponse.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.save({ id, ...updateUserDto });
  }

  public async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    return new UserReponseDto(user);
  }

  public findOneByPartial(user: Partial<User>) {
    return this.usersRepository.findOneBy(user);
  }

  public async delete(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.delete({ id });
  }
}
