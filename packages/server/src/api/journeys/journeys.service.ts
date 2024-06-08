import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InvoicesService } from '../invoices/invoices.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from './entities/journey.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';
import { PlaceType } from '../places/entities/place-type.enum';
import { TransitionsService } from '../transitions/transitions.service';
import { Transition } from '../transitions/entities/transition.entity';
import { VehiclesService } from '../vehicles/vehicles.service';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JourneysService {
  private logger = new Logger(JourneysService.name);

  constructor(
    @Inject(forwardRef(() => InvoicesService))
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

      const vehicle = await this.vehiclesService.getRandomAttachedVehicle(
        transition.targetPlace.id,
      );
      if (!vehicle) {
        this.logger.warn(
          `Failed to generate journey for invoice ${invoice.id}, because place ${transition.targetPlace.id} does not have ready vehicles attached`,
        );
        return;
      }

      await this.generateOrAttachJourney(invoice, transition, vehicle);
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

      const vehicle = await this.vehiclesService.getRandomAttachedVehicle(
        invoice.currentPlace.id,
      );
      if (!vehicle) {
        this.logger.warn(
          `Failed to generate journey for invoice ${invoice.id}, because place ${transition.targetPlace.id} does not have ready vehicles attached`,
        );
        return;
      }

      await this.generateOrAttachJourney(invoice, transition, vehicle);
    }
  }

  public async getCurrentJourney(user: User) {
    return this.journeyRepository.findOne({
      where: {
        startedAt: Not(IsNull()),
        endedAt: IsNull(),
        vehicle: { driver: { id: user.id } },
      },
      relations: [
        'transition.sourcePlace',
        'transition.targetPlace',
        'invoices.senderDepartment',
        'invoices.receiverDepartment',
        'invoices.currentPlace',
      ],
    });
  }

  public async getOngoingJourneys(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [journeys, count] = await this.journeyRepository.findAndCount({
      where: { startedAt: IsNull() },
      take,
      skip,
      order: { createdAt: 'DESC' },
      relations: ['transition.sourcePlace', 'transition.targetPlace'],
    });

    const totalPages = Math.ceil(count / take);

    return {
      data: journeys,
      totalPages,
    };
  }

  public async generateOrAttachJourney(
    invoice: Invoice,
    transition: Transition,
    vehicle: Vehicle,
  ) {
    let journeyInDb = await this.journeyRepository.findOneBy({
      transition: { id: transition.id },
      startedAt: IsNull(),
    });
    if (!journeyInDb) {
      journeyInDb = await this.journeyRepository.save({
        transition: { id: transition.id },
        vehicle: { id: vehicle.id },
      });
    }

    await this.invoicesService.attachJourney(invoice.id, journeyInDb);
  }

  public async startJourney(user: User, id: string) {
    const journey = await this.journeyRepository.findOne({
      where: { id },
      relations: ['vehicle.driver'],
    });
    if (!journey) throw new NotFoundException('Journey not found');

    if (journey.vehicle.driver.id !== user.id)
      throw new ForbiddenException(
        'You can not start a journey because are not attached to this vehicle',
      );

    if (journey.startedAt) throw new BadRequestException('Already started');

    const anotherStartedJourney = await this.journeyRepository.findOneBy({
      vehicle: { id: journey.vehicle.id },
      startedAt: Not(null),
      endedAt: null,
    });
    if (anotherStartedJourney)
      throw new BadRequestException('Already started another journey');

    await this.journeyRepository.save({ id, startedAt: new Date() });
  }
}
