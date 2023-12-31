import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.enum';
import { RoleGuard } from './role.guard';

@Injectable()
export class UserGuard extends RoleGuard {
  constructor() {
    super([Role.USER]);
  }
}
