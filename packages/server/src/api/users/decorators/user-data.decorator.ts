import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export const UserData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const { iat, exp, ...user } = request.user as {
      iat: number;
      exp: number;
    } & User;

    return user;
  },
);
