import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../entities/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly rolesToAccept: Role[]) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return (
      request.user &&
      request.user.role !== undefined &&
      this.rolesToAccept.includes(request.user.role)
    );
  }
}
