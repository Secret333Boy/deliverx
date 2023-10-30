import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  public getInfo() {
    return 'DeliverX api v1';
  }
}
