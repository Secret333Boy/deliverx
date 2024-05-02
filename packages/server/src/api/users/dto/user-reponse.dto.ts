import { Exclude } from 'class-transformer';
import { Role } from '../entities/role.enum';
import { ApiHideProperty } from '@nestjs/swagger';

export class UserReponseDto {
  constructor(partial: Partial<UserReponseDto>) {
    Object.assign(this, partial);
  }

  public id: string;

  public email: string;

  @Exclude()
  @ApiHideProperty()
  public hash: string;

  public firstName: string;

  public lastName: string;

  public role: Role;
}
