import { Module, forwardRef } from '@nestjs/common';
import { EventsService } from './events.service';
import { FlowEventEmitter } from './flow-event.emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EmailModule } from '../email/email.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    EmailModule,
    forwardRef(() => InvoicesModule),
  ],
  providers: [EventsService, FlowEventEmitter],
  controllers: [EventsController],
  exports: [EventsService, FlowEventEmitter],
})
export class EventsModule {}
