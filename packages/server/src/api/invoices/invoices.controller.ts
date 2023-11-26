import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserData } from '../users/decorators/user-data.decorator';
import { User } from '../users/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public getInvoices(
    @UserData() user: User,
    @Query('take', ParseIntPipe) take?: number,
    @Query('skip', ParseIntPipe) skip?: number,
  ) {
    return this.invoicesService.getInvoices(user, take || 100, skip || 0);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public getInvoice(
    @UserData() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.getInvoice(user, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public createInvoice(
    @UserData() user: User,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.createInvoice(user, createInvoiceDto);
  }
}
