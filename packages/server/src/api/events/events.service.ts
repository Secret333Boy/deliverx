import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { FlowEventEmitter, FlowEventPayload } from './flow-event.emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { FlowEventDto } from './dto/flow-event.dto';
import { User } from '../users/entities/user.entity';
import { EventType } from './entities/event-type.enum';
import { EmailService } from '../email/email.service';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @Inject(FlowEventEmitter) private flowEventEmitter: FlowEventEmitter,
    @Inject(forwardRef(() => InvoicesService))
    private invoicesService: InvoicesService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  public async emitEvent(user: User, flowEventDto: FlowEventDto) {
    const { invoiceId, type, journeyId } = flowEventDto;

    await this.invoicesService.getInvoice(user, invoiceId);

    const event = await this.eventsRepository.save({
      invoice: { id: invoiceId },
      type,
      ...(journeyId ? { journey: { id: journeyId } } : {}),
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(
        `Started processing event [${type}](${invoiceId}):${event.id}`,
      );
      await this.flowEventEmitter.emit(flowEventDto.type, {
        ...event,
        user,
        queryRunner,
      });

      const trackers = await this.invoicesService.getInvoiceTrackers(invoiceId);

      const eventTag = `${invoiceId}[${event.type}] - ${event.time}`;

      const message = `Event hit for tracked invoice: ${eventTag}`;

      for (const tracker of trackers) {
        try {
          await this.emailService.sendEmail(tracker.email, message, message);
          this.logger.debug(
            `Notified tracker ${tracker.email} about event $${eventTag}`,
          );
        } catch (e) {
          this.logger.error(`Failed to notify tracker ${tracker.email}: ${e}`);
        }
      }

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

      if (e instanceof Error) throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  public getInvoiceEvents(invoiceId: string) {
    return this.eventsRepository.find({
      where: { invoice: { id: invoiceId }, processed: true, failed: false },
      order: { time: 'asc' },
      relations: [
        'journey.transition.sourcePlace',
        'journey.transition.targetPlace',
      ],
    });
  }

  public async listen(
    event: EventType | '*',
    handler: (e: FlowEventPayload) => void | Promise<void>,
  ) {
    this.flowEventEmitter.on(event, handler);
  }
}
