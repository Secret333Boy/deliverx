import {
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  NotEquals,
  IsNumber,
} from 'class-validator';
import { Role } from '../entities/role.enum';

export class PatchWorkerDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @Length(8, 64)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  @NotEquals(Role.USER)
  role?: Exclude<Role, Role.USER>;

  @IsOptional()
  @IsString()
  placeId?: string;
}
