import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PlacesModule } from './places/places.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { EventsModule } from './events/events.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    InvoicesModule,
    PlacesModule,
    VehiclesModule,
    EventsModule,
    EmailModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
