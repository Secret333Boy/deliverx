import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
