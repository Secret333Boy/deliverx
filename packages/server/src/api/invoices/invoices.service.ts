/* eslint-disable no-case-declarations */
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UsersService } from '../users/users.service';
import { PlacesService } from '../places/places.service';
import { EventType } from '../events/entities/event-type.enum';
import { InvoiceEventProcessor } from './invoice-event.processor';
import { EventsService } from '../events/events.service';
import { UserInvoice } from './entities/user-invoice.entity';
import { Journey } from '../journeys/entities/journey.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JourneysService } from '../journeys/journeys.service';

@Injectable()
export class InvoicesService {
  private readonly INVOICE_NOT_FOUND_EXCEPTION_MESSAGE = 'Invoice not found';
  private readonly INVOICE_FORBIDDEN_EXCEPTION_MESSAGE =
    'You are forbidden to access this invoice';
  private readonly INVOICE_NOT_A_WORKER_FORBIDDEN_EXCEPTION_MESSAGE =
    'Not a worker';

  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @InjectRepository(UserInvoice)
    private userInvoiceRepository: Repository<UserInvoice>,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(PlacesService) private placesService: PlacesService,
    @Inject(JourneysService) private journeysService: JourneysService,
    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService,
    @Inject(InvoiceEventProcessor)
    private invoiceEventProcessor: InvoiceEventProcessor,
  ) {
    this.listenToFlowEvents();
  }

  public listenToFlowEvents() {
    this.eventsService.listen(
      '*',
      async (event) => await this.invoiceEventProcessor.process(event),
    );

    this.logger.debug(`Listening to flow events`);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async recheckInvoicesForJourneyInclusion() {
    const invoicesStream = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.currentPlace', 'currentPlace')
      .leftJoinAndSelect('invoice.receiverDepartment', 'receiverDepartment')
      // .leftJoinAndSelect('invoice.senderDepartment', 'senderDepartment')
      .leftJoinAndSelect('invoice.journey', 'journey')
      .select()
      .stream();

    for await (const rawInvoice of invoicesStream) {
      const invoice = {
        currentPlace: null,
        journey: null,
        receiverDepartment: null,
      };

      for (const key of Object.keys(rawInvoice)) {
        if (key.startsWith('invoice_')) {
          const invoiceKey = key.replace('invoice_', '');

          invoice[invoiceKey] = rawInvoice[key];
        } else if (key.startsWith('currentPlace_')) {
          if (!rawInvoice[key]) continue;

          if (invoice.currentPlace === null && rawInvoice[key])
            invoice.currentPlace = {};

          const currentPlaceKey = key.replace('currentPlace_', '');

          invoice.currentPlace[currentPlaceKey] = rawInvoice[key];
        } else if (key.startsWith('journey_')) {
          if (!rawInvoice[key]) continue;

          if (invoice.journey === null) invoice.journey = {};

          const journeyKey = key.replace('journey_', '');

          invoice.journey[journeyKey] = rawInvoice[key];
        } else if (key.startsWith('receiverDepartment_')) {
          if (!rawInvoice[key]) continue;

          if (invoice.receiverDepartment === null)
            invoice.receiverDepartment = {};

          const receiverDepartmentKey = key.replace('receiverDepartment_', '');

          invoice.receiverDepartment[receiverDepartmentKey] = rawInvoice[key];
        }
      }

      await this.journeysService.initiateJourney(<Invoice>invoice);
    }
  }

  public async getInvoices(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [invoices, count] = await this.invoiceRepository.findAndCount({
      where: { creator: { id: user.id } },
      take,
      skip,
    });

    const totalPages = Math.ceil(count / take);

    return { invoices, totalPages };
  }

  public async getInplaceInvoices(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const isWorker = user.role !== Role.USER;
    if (!isWorker)
      throw new ForbiddenException(
        this.INVOICE_NOT_A_WORKER_FORBIDDEN_EXCEPTION_MESSAGE,
      );

    const currentPlace = await this.usersService.getWorkerPlace(user.id);

    if (!currentPlace) return { invoices: [], totalPages: 1 };

    const [invoices, count] = await this.invoiceRepository.findAndCount({
      where: { currentPlace: { id: currentPlace.id } },
      take,
      skip,
    });

    const totalPages = Math.ceil(count / take);

    return { invoices, totalPages };
  }

  public async getPlaceInvoices(id: string, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const place = await this.placesService.getPlace(id);

    const [invoices, count] = await this.invoiceRepository.findAndCount({
      where: { currentPlace: { id: place.id } },
      take,
      skip,
    });

    const totalPages = Math.ceil(count / take);

    return { invoices, totalPages };
  }

  public async getInplaceInvoicesByJourneyId(
    user: User,
    journeyId: string,
    take = 100,
    skip = 0,
  ) {
    if (take > 100) take = 100;

    const workerPlace = await this.usersService.getWorkerPlace(user.id);

    if (!workerPlace) return { invoices: [], totalPages: 1 };

    const [invoices, count] = await this.invoiceRepository.findAndCount({
      where: {
        currentPlace: { id: workerPlace.id },
        journey: { id: journeyId },
      },
      take,
      skip,
    });

    const totalPages = Math.ceil(count / take);

    return { invoices, totalPages };
  }

  public async getInvoice(user: User, id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id,
      },
      relations: ['creator', 'currentPlace'],
    });

    if (!invoice)
      throw new NotFoundException(this.INVOICE_NOT_FOUND_EXCEPTION_MESSAGE);

    const isWorker = user.role !== Role.USER;

    if (
      !isWorker &&
      invoice.creator.id !== user.id &&
      invoice.receiverEmail !== user.email
    )
      throw new ForbiddenException(this.INVOICE_FORBIDDEN_EXCEPTION_MESSAGE);

    delete invoice.creator;
    return invoice;
  }

  public async getInvoiceEvents(user: User, id: string) {
    const invoice = await this.getInvoice(user, id);

    const events = await this.eventsService.getInvoiceEvents(invoice.id);

    return events;
  }

  public async createInvoice(user: User, createInvoiceDto: CreateInvoiceDto) {
    const { senderDepartmentId, receiverDepartmentId, ...invoiceData } =
      createInvoiceDto;

    const senderDepartment =
      await this.placesService.getDepartment(senderDepartmentId);
    const receiverDepartment =
      await this.placesService.getDepartment(receiverDepartmentId);

    const invoice = await this.invoiceRepository.save({
      ...invoiceData,
      senderDepartment: { id: senderDepartment.id },
      receiverDepartment: { id: receiverDepartment.id },
      creator: { id: user.id },
    });

    await this.userInvoiceRepository.save({
      userId: user.id,
      invoiceId: invoice.id,
    });

    await this.eventsService.emitEvent(user, {
      invoiceId: invoice.id,
      type: EventType.CREATED,
    });
  }

  public async setInvoiceCurrentPlace(
    id: string,
    placeId: string,
    queryRunner?: QueryRunner,
  ) {
    const entityManager =
      queryRunner?.manager || this.invoiceRepository.manager;

    const place = await this.placesService.getPlace(placeId);
    const invoice = await this.invoiceRepository.findOneBy({ id });

    if (!invoice)
      throw new NotFoundException(this.INVOICE_NOT_FOUND_EXCEPTION_MESSAGE);

    await entityManager.save(Invoice, {
      id: invoice.id,
      currentPlace: { id: place.id },
    });
  }

  public async trackInvoice(user: User, id: string) {
    const invoice = await this.getInvoice(user, id);

    await this.userInvoiceRepository.save({
      userId: user.id,
      invoiceId: invoice.id,
    });
  }

  public async untrackInvoice(user: User, id: string) {
    const invoice = await this.getInvoice(user, id);

    await this.userInvoiceRepository.delete({
      userId: user.id,
      invoiceId: invoice.id,
    });
  }

  public async getTrackedInvoices(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [userInvoices, count] = await this.userInvoiceRepository.findAndCount(
      {
        where: { userId: user.id },
        take,
        skip,
      },
    );

    const invoiceIds = userInvoices.map((userInvoice) => userInvoice.invoiceId);

    const invoices = await this.invoiceRepository.findBy({
      id: In(invoiceIds),
    });

    const totalPages = Math.ceil(count / take);

    return { invoices, totalPages };
  }

  public async getInvoiceTrackers(id: string) {
    const records = await this.userInvoiceRepository.findBy({ invoiceId: id });

    const userIds = records.map((record) => record.userId);

    const trackers = await this.usersService.getBulkUsers(userIds);

    return trackers;
  }

  public async attachJourney(id: string, journey: Journey) {
    await this.invoiceRepository.save({ id, journey: { id: journey.id } });
  }
}
