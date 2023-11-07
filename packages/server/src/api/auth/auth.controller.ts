import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Headers,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import RegisterDto from './dtos/register.dto';
import { Role } from '../users/entities/role.enum';

const COOKIE_EXPIRE_TIME = 15 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('register')
  public async register(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: RegisterDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api',
      maxAge: COOKIE_EXPIRE_TIME,
    });

    return { accessToken };
  }

  @Post('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api',
      maxAge: COOKIE_EXPIRE_TIME,
    });

    return { accessToken };
  }

  @Get('validate')
  public async validate(
    @Headers('Authorization') authorization?: string,
  ): Promise<void> {
    const token = authorization?.replace('Bearer', '').trim();
    return this.authService.validate(token || '');
  }

  @Get('validate-admin')
  public async validateAdmin(
    @Headers('Authorization') authorization?: string,
  ): Promise<void> {
    const token = authorization?.replace('Bearer', '').trim();
    return this.authService.validate(token || '', [Role.ADMIN]);
  }

  @Get('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshTokenFromCookie = req.cookies.refreshToken || '';
    const { accessToken, refreshToken } = await this.authService.refresh(
      refreshTokenFromCookie,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api',
      maxAge: COOKIE_EXPIRE_TIME,
    });

    return { accessToken };
  }

  @Delete('logout')
  public async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      path: '/api',
      maxAge: 0,
    });
  }
}
