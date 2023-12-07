import { Injectable } from '@nestjs/common';
import { EventType } from './entities/event-type.enum';
import { EventEmitter } from './event.emitter';
import { Event } from './entities/event.entity';
import { QueryRunner } from 'typeorm';
import { User } from '../users/entities/user.entity';

export type FlowEventPayload = Event & { queryRunner: QueryRunner; user: User };

@Injectable()
export class FlowEventEmitter extends EventEmitter<
  EventType,
  FlowEventPayload
> {}
