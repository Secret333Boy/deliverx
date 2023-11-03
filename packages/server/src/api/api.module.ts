import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [UsersModule],
})
export class ApiModule {}
