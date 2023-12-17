/* eslint-disable no-case-declarations */
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UsersService } from '../users/users.service';
import { PlacesService } from '../places/places.service';
import { FlowEventEmitter } from '../events/flow-event.emitter';
import { EventType } from '../events/entities/event-type.enum';
import { InvoiceEventProcessor } from './invoice-event.processor';
import { EventsService } from '../events/events.service';
import { UserInvoice } from './entities/user-invoice.entity';

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
    @Inject(FlowEventEmitter) private flowEventEmitter: FlowEventEmitter,
    @Inject(EventsService) private eventsService: EventsService,
    @Inject(InvoiceEventProcessor)
    private invoiceEventProcessor: InvoiceEventProcessor,
  ) {
    this.listenToFlowEvents();
  }

  public listenToFlowEvents() {
    this.flowEventEmitter.on(
      '*',
      async (event) => await this.invoiceEventProcessor.process(event),
    );

    this.logger.debug(`Listening to flow events`);
  }

  public getInvoices(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    return this.invoiceRepository.find({
      where: { creator: { id: user.id } },
      take,
      skip,
    });
  }

  public async getInplaceInvoices(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const isWorker = user.role !== Role.USER;

    if (!isWorker)
      throw new ForbiddenException(
        this.INVOICE_NOT_A_WORKER_FORBIDDEN_EXCEPTION_MESSAGE,
      );

    const currentPlace = await this.usersService.getWorkerPlace(user.id);

    if (!currentPlace) return [];

    return this.invoiceRepository.find({
      where: { currentPlace: { id: currentPlace.id } },
      take,
      skip,
    });
  }

  public async getPlaceInvoices(id: number, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const place = await this.placesService.getPlace(id);

    return this.invoiceRepository.find({
      where: { currentPlace: { id: place.id } },
      take,
      skip,
    });
  }

  public async getInvoice(user: User, id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id,
      },
      relations: ['creator'],
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

  public async createInvoice(user: User, createInvoiceDto: CreateInvoiceDto) {
    const invoice = await this.invoiceRepository.save({
      ...createInvoiceDto,
      creator: { id: user.id },
    });

    this.eventsService.emitEvent(user, {
      invoiceId: invoice.id,
      type: EventType.CREATED,
    });
  }

  public async setInvoiceCurrentPlace(
    id: string,
    placeId: number,
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

  public async getTrackedInvoices(user: User, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const [invoiceIds, count] = await this.userInvoiceRepository.findAndCount({
      where: { userId: user.id },
      take,
      skip,
    });

    const invoices = this.invoiceRepository.findBy({ id: In(invoiceIds) });

    const totalPages = Math.ceil(count / take);

    return { invoices, totalPages };
  }
}
