import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtAccessStrategy } from '../auth/strategies';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtAccessStrategy, PlacesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
