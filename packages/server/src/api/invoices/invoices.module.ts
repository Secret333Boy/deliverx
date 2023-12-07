import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { UsersModule } from '../users/users.module';
import { PlacesModule } from '../places/places.module';
import { EventsModule } from '../events/events.module';
import { InvoiceEventProcessor } from './invoice-event.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    UsersModule,
    PlacesModule,
    EventsModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceEventProcessor],
})
export class InvoicesModule {}
