import { Injectable, Logger } from '@nestjs/common';
import { FlowEventPayload } from '../events/flow-event.emitter';
import { Invoice } from './entities/invoice.entity';
import { EventType } from '../events/entities/event-type.enum';
import { User } from '../users/entities/user.entity';
import { FlowEventProcessor } from '../events/flow-event-processor.interface';
import { Journey } from '../journeys/entities/journey.entity';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class InvoiceEventProcessor implements FlowEventProcessor {
  private readonly INVOICE_NOT_FOUND_EXCEPTION_MESSAGE = `Invoice not found`;
  private readonly WORKER_INSUFICIANT_PLACE_EXCEPTION_MESSAGE = `Worker has different place from needed one by event`;
  private readonly INVOICE_ALREADY_HAS_PLACE_EXCEPTION_MESSAGE = `Invoice already has current place. Tried to perform ${EventType.GOT} event on invoice with current place set`;
  private readonly INVOICE_NOT_ON_FINAL_NODE_EXCEPTION_MESSAGE = `Invoice is not on final node. Tried to perform ${EventType.GIVEN} event on invoice with current place set not to final node`;
  private readonly INVOICE_IS_FINISHED_EXCEPTION_MESSAGE = `Invoice is already finished`;
  private readonly JOURNEY_NOT_FOUND_EXCEPTION_MESSAGE = `Active journey not found`;

  private readonly logger = new Logger(InvoiceEventProcessor.name);

  public async process({ queryRunner, user, ...event }: FlowEventPayload) {
    const invoice = await queryRunner.manager.findOne(Invoice, {
      where: { id: event.invoice.id },
      relations: ['currentPlace', 'senderDepartment', 'receiverDepartment'],
    });
    if (!invoice) throw new Error(this.INVOICE_NOT_FOUND_EXCEPTION_MESSAGE);
    if (invoice.isFinished)
      throw new Error(this.INVOICE_IS_FINISHED_EXCEPTION_MESSAGE);

    this.logger.debug(
      `[${event.type}](${invoice.id}):${event.id} Found invoice`,
    );

    const { place: workerPlace } = await queryRunner.manager.findOne(User, {
      where: { id: user.id },
      relations: ['place'],
    });

    const journey = event.journey?.id
      ? await queryRunner.manager.findOne(Journey, {
          where: {
            id: event.journey.id,
            vehicle: { driver: { id: user.id } },
            startedAt: Not(IsNull()),
          },
          relations: ['transition'],
        })
      : null;

    switch (event.type) {
      case EventType.GOT:
        if (!workerPlace || workerPlace.id !== invoice.senderDepartment.id)
          throw new Error(this.WORKER_INSUFICIANT_PLACE_EXCEPTION_MESSAGE);
        this.logger.debug(
          `[${event.type}](${invoice.id}):${event.id} Worker place is correct`,
        );

        if (invoice.currentPlace || invoice.isInJourney)
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
        if (!workerPlace || workerPlace.id !== invoice.receiverDepartment.id)
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
      case EventType.ONBOARD:
        if (!journey) throw new Error(this.JOURNEY_NOT_FOUND_EXCEPTION_MESSAGE);
        if (invoice.currentPlace.id !== journey.transition.sourcePlaceId)
          throw new Error('Not in source node of journey');

        await queryRunner.manager.save(Invoice, {
          id: invoice.id,
          currentPlace: null,
          isInJourney: true,
        });
        break;
      case EventType.TRANSITIONED:
        if (!journey) throw new Error(this.JOURNEY_NOT_FOUND_EXCEPTION_MESSAGE);
        if (!invoice.isInJourney) {
          throw new Error(
            'Not in journey. Tryied to perform transitioned event on invoice which in not in journey',
          );
        }

        await queryRunner.manager.save(Invoice, {
          id: invoice.id,
          currentPlace: { id: journey.transition.targetPlaceId },
          isInJourney: false,
          journey: null,
        });

        // eslint-disable-next-line no-case-declarations
        const journeyInvoicesLeft = await queryRunner.manager.countBy(Invoice, {
          journey: { id: journey.id },
        });

        if (journeyInvoicesLeft === 0)
          await queryRunner.manager.save(Journey, {
            id: journey.id,
            endedAt: new Date(),
          });
        break;
      default:
        break;
    }
  }
}
