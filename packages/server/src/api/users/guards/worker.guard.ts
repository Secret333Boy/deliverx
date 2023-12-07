import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.enum';
import { RoleGuard } from './role.guard';

@Injectable()
export class WorkerGuard extends RoleGuard {
  constructor() {
    super([
      Role.DEPARTMENT_WORKER,
      Role.SORT_CENTER_WORKER,
      Role.DRIVER,
      Role.ADMIN,
    ]);
  }
}
