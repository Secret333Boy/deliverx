import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import LoginDto from './dtos/login.dto';
import RegisterDto from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { Tokens, TokenService } from './token/token.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../users/entities/role.enum';

@Injectable()
export class AuthService {
  private CONFLICT_MESSAGE = 'User with this email already exists';
  private PASSWORD_NOT_VALID_MESSAGE = 'Password is not valid';

  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(TokenService) private tokenService: TokenService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<Tokens> {
    let userInDB;
    try {
      userInDB = await this.usersService.findOneByPartial({
        email: registerDto.email,
      });
    } catch (e) {
      /* empty */
    }
    if (userInDB) throw new ConflictException(this.CONFLICT_MESSAGE);
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(registerDto.password, salt);
    const { email, firstName, lastName } = registerDto;
    const newAccountData: CreateUserDto = {
      email,
      hash,
      firstName,
      lastName,
      role: Role.USER,
    };
    const account = await this.usersService.create(newAccountData);
    return this.tokenService.generateTokens(account);
  }

  public async login(loginDto: LoginDto): Promise<Tokens> {
    const userInDB = await this.usersService.findOneByPartial({
      email: loginDto.email,
    });
    const isValid = bcrypt.compareSync(loginDto.password, userInDB.hash);
    if (!isValid)
      throw new BadRequestException(this.PASSWORD_NOT_VALID_MESSAGE);

    return this.tokenService.generateTokens(userInDB);
  }

  public async validate(
    accessToken: string,
    requiredRoles = [Role.USER, Role.ADMIN],
  ): Promise<void> {
    const account = this.tokenService.verifyAccessToken(accessToken);
    const accountInDB = await this.usersService.findOneByPartial({
      email: account.email,
    });
    if (!requiredRoles.includes(accountInDB.role))
      throw new ForbiddenException("You don't have required role");
  }

  public async refresh(refreshToken: string): Promise<Tokens> {
    const account = await this.tokenService.verifyRefreshToken(refreshToken);
    const accountInDB = await this.usersService.findOne(account.id);

    return this.tokenService.generateTokens(accountInDB);
  }
}
