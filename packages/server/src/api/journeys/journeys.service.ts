import { Inject, Injectable, Logger } from '@nestjs/common';
import { InvoicesService } from '../invoices/invoices.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from './entities/journey.entity';
import { Repository } from 'typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';
import { PlaceType } from '../places/entities/place-type.enum';
import { TransitionsService } from '../transitions/transitions.service';
import { Transition } from '../transitions/entities/transition.entity';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class JourneysService {
  private logger = new Logger(JourneysService.name);

  constructor(
    @Inject(InvoicesService)
    private invoicesService: InvoicesService,
    @Inject(TransitionsService)
    private transitionsService: TransitionsService,
    @Inject(VehiclesService)
    private vehiclesService: VehiclesService,
    @InjectRepository(Journey) private journeyRepository: Repository<Journey>,
  ) {}

  public async initiateJourney(invoice: Invoice) {
    if (!invoice.currentPlace || invoice.isFinished || invoice.journey) return;

    if (invoice.currentPlace.type === PlaceType.DEPARTMENT) {
      const transition =
        await this.transitionsService.getTransitionToTheClosestSortCenter(
          invoice.currentPlace,
        );

      await this.generateOrAttachJourney(invoice, transition);
    } else {
      let transition = await this.transitionsService.getTransitionBetween(
        invoice.currentPlace,
        invoice.receiverDepartment,
      );
      if (!transition) {
        const target = await this.transitionsService.getClosestSortCenter(
          invoice.receiverDepartment,
        );
        if (!target) {
          this.logger.warn(
            `Failed to generate journey, because there is no transtion ways from ${invoice.currentPlace.id} to ${target.id}`,
          );
          return;
        }

        transition = await this.transitionsService.getTransitionBetween(
          invoice.currentPlace,
          target,
        );
      }

      await this.generateOrAttachJourney(invoice, transition);
    }
  }

  public async generateOrAttachJourney(
    invoice: Invoice,
    transition: Transition,
  ) {
    let journeyInDb = await this.journeyRepository.findOneBy({
      transition: { id: transition.id },
    });
    if (!journeyInDb) {
      const vehicle = await this.vehiclesService.getRandomVehicle(
        transition.targetPlace.id,
      );
      if (!vehicle) {
        this.logger.warn(
          `Failed to generate journey, because place ${transition.targetPlace.id} does not have vehicles attached`,
        );
        return;
      }

      journeyInDb = await this.journeyRepository.save({
        transition: { id: transition.id },
        vehicle: { id: vehicle.id },
      });
    }

    await this.invoicesService.attachJourney(invoice.id, journeyInDb);
  }
}
