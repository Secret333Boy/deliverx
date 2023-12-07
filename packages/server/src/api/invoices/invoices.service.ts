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
import { QueryRunner, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UsersService } from '../users/users.service';
import { PlacesService } from '../places/places.service';
import { FlowEventEmitter } from '../events/flow-event.emitter';
import { EventType } from '../events/entities/event-type.enum';
import { InvoiceEventProcessor } from './invoice-event.processor';

@Injectable()
export class InvoicesService {
  private readonly INVOICE_NOT_FOUND_EXCEPTION_MESSAGE = 'Invoice not found';
  private readonly INVOICE_NOT_A_WORKER_FORBIDDEN_EXCEPTION_MESSAGE =
    'Not a worker';

  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(PlacesService) private placesService: PlacesService,
    @Inject(FlowEventEmitter) private flowEventEmitter: FlowEventEmitter,
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

  public async getPlaceInvoices(user: User, id: number, take = 100, skip = 0) {
    if (take > 100) take = 100;

    const isWorker = user.role !== Role.USER;

    if (!isWorker)
      throw new ForbiddenException(
        this.INVOICE_NOT_A_WORKER_FORBIDDEN_EXCEPTION_MESSAGE,
      );

    const place = await this.placesService.getPlace(id);

    return this.invoiceRepository.find({
      where: { currentPlace: { id: place.id } },
      take,
      skip,
    });
  }

  public async getInvoice(user: User, id: string) {
    const isWorker = user.role !== Role.USER;

    const invoice = await this.invoiceRepository.findOneBy({
      id,
      ...(isWorker ? {} : { creator: { id: user.id } }),
    });

    if (!invoice)
      throw new NotFoundException(this.INVOICE_NOT_FOUND_EXCEPTION_MESSAGE);

    return invoice;
  }

  public async createInvoice(user: User, createInvoiceDto: CreateInvoiceDto) {
    await this.invoiceRepository.save({
      ...createInvoiceDto,
      creator: { id: user.id },
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
}
