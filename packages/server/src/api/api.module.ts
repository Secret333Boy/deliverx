import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PlacesModule } from './places/places.module';

@Module({
  imports: [AuthModule, UsersModule, InvoicesModule, PlacesModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
