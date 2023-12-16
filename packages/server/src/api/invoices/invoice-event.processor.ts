import { Injectable, Logger } from '@nestjs/common';
import { FlowEventPayload } from '../events/flow-event.emitter';
import { Invoice } from './entities/invoice.entity';
import { EventType } from '../events/entities/event-type.enum';
import { User } from '../users/entities/user.entity';
import { FlowEventProcessor } from '../events/flow-event-processor.interface';

@Injectable()
export class InvoiceEventProcessor implements FlowEventProcessor {
  private readonly INVOICE_NOT_FOUND_EXCEPTION_MESSAGE = `Invoice not found`;
  private readonly WORKER_INSUFICIANT_PLACE_EXCEPTION_MESSAGE = `Worker has different place from needed one by event`;
  private readonly INVOICE_ALREADY_HAS_PLACE_EXCEPTION_MESSAGE = `Invoice already has current place. Tried to perform ${EventType.GOT} event on invoice with current place set`;
  private readonly INVOICE_NOT_ON_FINAL_NODE_EXCEPTION_MESSAGE = `Invoice is not on final node. Tried to perform ${EventType.GIVEN} event on invoice with current place set not to final node`;
  private readonly INVOICE_IS_FINISHED_EXCEPTION_MESSAGE = `Invoice is already finished`;

  private readonly logger = new Logger(InvoiceEventProcessor.name);

  public async process({ queryRunner, user, ...event }: FlowEventPayload) {
    const invoice = await queryRunner.manager.findOne(Invoice, {
      where: { id: event.invoice.id },
      relations: ['currentPlace', 'senderDepartment', 'receiverDepartment'],
    });
    if (!invoice) throw new Error(this.INVOICE_NOT_FOUND_EXCEPTION_MESSAGE);
    if (invoice.finished)
      throw new Error(this.INVOICE_IS_FINISHED_EXCEPTION_MESSAGE);

    this.logger.debug(
      `[${event.type}](${invoice.id}):${event.id} Found invoice`,
    );

    const { place: workerPlace } = await queryRunner.manager.findOne(User, {
      where: { id: user.id },
      relations: ['place'],
    });
    if (!workerPlace)
      throw new Error(this.WORKER_INSUFICIANT_PLACE_EXCEPTION_MESSAGE);

    switch (event.type) {
      case EventType.GOT:
        if (workerPlace.id !== invoice.senderDepartment.id)
          throw new Error(this.WORKER_INSUFICIANT_PLACE_EXCEPTION_MESSAGE);
        this.logger.debug(
          `[${event.type}](${invoice.id}):${event.id} Worker place is correct`,
        );

        if (invoice.currentPlace)
          throw new Error(this.INVOICE_ALREADY_HAS_PLACE_EXCEPTION_MESSAGE);
        this.logger.debug(
          `[${event.type}](${invoice.id}):${event.id} Invoice target: ${invoice.senderDepartment.id}`,
        );

        await queryRunner.manager.save(Invoice, {
          id: invoice.id,
          currentPlace: { id: invoice.senderDepartment.id },
        });
        break;
      case EventType.GIVEN:
        if (workerPlace.id !== invoice.receiverDepartment.id)
          throw new Error(this.WORKER_INSUFICIANT_PLACE_EXCEPTION_MESSAGE);
        this.logger.debug(
          `[${event.type}](${invoice.id}):${event.id} Worker place is correct`,
        );

        if (
          !invoice.currentPlace ||
          invoice.currentPlace.id !== invoice.receiverDepartment.id
        )
          throw new Error(this.INVOICE_NOT_ON_FINAL_NODE_EXCEPTION_MESSAGE);

        this.logger.debug(
          `[${event.type}](${invoice.id}):${event.id} Invoice finished`,
        );

        await queryRunner.manager.save(Invoice, {
          id: invoice.id,
          currentPlace: null,
          finished: true,
        });
        break;
      default:
        break;
    }
  }
}
