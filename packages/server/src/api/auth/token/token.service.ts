import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { TokenStore } from './entities/token-store.entity';
import { User } from 'src/api/users/entities/user.entity';
import { UserReponseDto } from 'src/api/users/dto/user-reponse.dto';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokenService {
  private INVALID_TOKEN_MESSAGE = 'Your token has expired or is not valid';

  constructor(
    private jwtService: JwtService,
    @InjectRepository(TokenStore)
    private tokenRepository: Repository<TokenStore>,
  ) {}

  public async generateTokens(
    user: Omit<User, 'trackedInvoices' | 'place'>,
  ): Promise<Tokens> {
    const data = instanceToPlain(new UserReponseDto(user));
    const accessToken = this.jwtService.sign(data, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(data, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '15d',
    });

    await this.tokenRepository.upsert({ user: user, token: refreshToken }, [
      'user.id',
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public verifyAccessToken(token: string): Omit<User, 'hash'> {
    try {
      const { exp, iat, ...user } = this.jwtService.verify<
        { exp: number; iat: number } & Omit<User, 'hash'>
      >(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return user;
    } catch (e) {
      throw new UnauthorizedException(this.INVALID_TOKEN_MESSAGE);
    }
  }

  public async verifyRefreshToken(token: string): Promise<Omit<User, 'hash'>> {
    try {
      const account = this.jwtService.verify<Omit<User, 'hash'>>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const recordInDb = await this.tokenRepository.findOneBy({
        user: { id: account.id },
      });

      if (!recordInDb || token !== recordInDb.token)
        throw new UnauthorizedException(this.INVALID_TOKEN_MESSAGE);

      return account;
    } catch (e) {
      throw new UnauthorizedException(this.INVALID_TOKEN_MESSAGE);
    }
  }
}
