import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Module({
  providers: [VehiclesService],
})
export class VehiclesModule {}
