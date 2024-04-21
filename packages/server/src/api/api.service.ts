import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  public getInfo() {
    return 'DeliverX API v1';
  }
}
