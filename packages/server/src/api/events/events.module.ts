import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { FlowEventEmitter } from './flow-event.emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService, FlowEventEmitter],
  controllers: [EventsController],
})
export class EventsModule {}
