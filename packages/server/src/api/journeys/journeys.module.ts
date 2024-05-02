import { Module, forwardRef } from '@nestjs/common';
import { JourneysController } from './journeys.controller';
import { JourneysService } from './journeys.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from './entities/journey.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { TransitionsModule } from '../transitions/transitions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey]),
    forwardRef(() => InvoicesModule),
    TransitionsModule,
    VehiclesModule,
  ],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}
