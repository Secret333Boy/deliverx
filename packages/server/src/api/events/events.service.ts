import { Inject, Injectable, Logger } from '@nestjs/common';
import { FlowEventEmitter } from './flow-event.emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { FlowEventDto } from './dto/flow-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @Inject(FlowEventEmitter) private flowEventEmitter: FlowEventEmitter,
  ) {}

  public async emitEvent(flowEventDto: FlowEventDto) {
    const { invoiceId, type, transitionId } = flowEventDto;

    const event = await this.eventsRepository.save({
      invoice: { id: invoiceId },
      type,
      ...(transitionId ? { transition: { id: transitionId } } : {}),
    });

    let success = true;

    try {
      this.logger.log(`Started processing event [${type}](${invoiceId})`);
      await this.flowEventEmitter.emit(flowEventDto.type, event);
      this.logger.log(`Successfully processed event [${type}](${invoiceId})`);
    } catch (e) {
      success = false;
      this.logger.error(`Failed to process event [${type}](${invoiceId})`, e);
    }

    await this.eventsRepository.save({
      id: event.id,
      processed: success,
      failed: !success,
    });
  }
}
