import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export default class RegisterDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 63)
  public password: string;
}
