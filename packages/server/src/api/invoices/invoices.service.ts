import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UsersService } from '../users/users.service';
import { PlacesService } from '../places/places.service';

@Injectable()
export class InvoicesService {
  private readonly INVOICE_NOT_FOUND_EXCEPTION_MESSAGE = 'Invoice not found';
  private readonly INVOICE_NOT_A_WORKER_FORBIDDEN_EXCEPTION_MESSAGE =
    'Not a worker';

  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(PlacesService) private placesService: PlacesService,
  ) {}

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
}
