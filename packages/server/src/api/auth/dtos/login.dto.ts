import { IsEmail, Length } from 'class-validator';

export default class LoginDto {
  @IsEmail()
  public email: string;

  @Length(8, 63)
  public password: string;
}
