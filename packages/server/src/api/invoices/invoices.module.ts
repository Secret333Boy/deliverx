import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { UsersModule } from '../users/users.module';
import { PlacesModule } from '../places/places.module';
import { EventsModule } from '../events/events.module';
import { InvoiceEventProcessor } from './invoice-event.processor';
import { UserInvoice } from './entities/user-invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, UserInvoice]),
    UsersModule,
    PlacesModule,
    EventsModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceEventProcessor],
  exports: [InvoicesService],
})
export class InvoicesModule {}
