import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  Length,
  NotEquals,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Role } from '../entities/role.enum';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @NotEquals(Role.USER)
  role: Exclude<Role, Role.USER>;

  @IsOptional()
  @IsNumber()
  placeId?: number;
}
