import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FlowEventEmitter } from './flow-event.emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { FlowEventDto } from './dto/flow-event.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @Inject(FlowEventEmitter) private flowEventEmitter: FlowEventEmitter,
  ) {}

  public async emitEvent(user: User, flowEventDto: FlowEventDto) {
    const { invoiceId, type, transitionId } = flowEventDto;

    const event = await this.eventsRepository.save({
      invoice: { id: invoiceId },
      type,
      ...(transitionId ? { transition: { id: transitionId } } : {}),
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let err: Error | undefined = undefined;

    try {
      this.logger.log(
        `Started processing event [${type}](${invoiceId}):${event.id}`,
      );
      await this.flowEventEmitter.emit(flowEventDto.type, {
        ...event,
        user,
        queryRunner,
      });

      await queryRunner.manager.save(Event, { id: event.id, processed: true });

      await queryRunner.commitTransaction();
      this.logger.log(
        `Successfully processed event [${type}](${invoiceId}):${event.id}`,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to process event [${type}](${invoiceId}):${event.id}`,
        e,
      );

      await this.eventsRepository.save({ id: event.id, failed: true });

      err = e;
    }

    await queryRunner.release();

    if (err) throw new BadRequestException(err.message);
  }

  public getInvoiceEvents(invoiceId: string) {
    return this.eventsRepository.find({
      where: { invoice: { id: invoiceId }, processed: true, failed: false },
      order: { time: 'asc' },
    });
  }
}
