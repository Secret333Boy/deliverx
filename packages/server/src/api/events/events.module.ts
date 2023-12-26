import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { FlowEventEmitter } from './flow-event.emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), EmailModule],
  providers: [EventsService, FlowEventEmitter],
  controllers: [EventsController],
  exports: [EventsService, FlowEventEmitter],
})
export class EventsModule {}
