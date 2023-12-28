import {
  Body,
  Controller,
  Delete,
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
import { AdminGuard } from '../users/guards/admin.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public getInvoices(
    @UserData() user: User,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.invoicesService.getInvoices(user, +take || 100, +skip || 0);
  }

  @Get('/inplace')
  @UseGuards(JwtAuthGuard)
  public getInplaceInvoices(
    @UserData() user: User,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.invoicesService.getInplaceInvoices(
      user,
      +take || 100,
      +skip || 0,
    );
  }

  @Get('/inplace/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getPlaceInvoices(
    @Param('id', ParseIntPipe) id?: number,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.invoicesService.getPlaceInvoices(id, +take || 100, +skip || 0);
  }

  @Get('/tracked')
  @UseGuards(JwtAuthGuard)
  public getTrackedInvoices(
    @UserData() user: User,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.invoicesService.getTrackedInvoices(
      user,
      +take || 100,
      +skip || 0,
    );
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public getInvoice(
    @UserData() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.getInvoice(user, id);
  }

  @Get('/:id/events')
  @UseGuards(JwtAuthGuard)
  public getInvoiceEvents(
    @UserData() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.getInvoiceEvents(user, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public createInvoice(
    @UserData() user: User,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.createInvoice(user, createInvoiceDto);
  }

  @Post('/:id/track')
  @UseGuards(JwtAuthGuard)
  public trackInvoice(
    @UserData() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.trackInvoice(user, id);
  }

  @Delete('/:id/untrack')
  @UseGuards(JwtAuthGuard)
  public untrackInvoice(
    @UserData() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.untrackInvoice(user, id);
  }
}
