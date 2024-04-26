import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export const UserData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const { ...user } = request.user as {
      iat: number;
      exp: number;
    } & User;

    delete user.iat;
    delete user.exp;

    return user;
  },
);
