import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../entities/role.enum';

export class CreateUserDto {
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
  hash: string;

  @IsEnum(Role)
  role: Role;
}
