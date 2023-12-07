import { Injectable } from '@nestjs/common';
import { EventType } from './entities/event-type.enum';
import { EventEmitter } from './event.emitter';
import { Event } from './entities/event.entity';

@Injectable()
export class FlowEventEmitter extends EventEmitter<EventType, Event> {}
