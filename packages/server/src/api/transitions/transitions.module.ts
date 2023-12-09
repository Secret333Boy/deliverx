import { Module } from '@nestjs/common';
import { TransitionsService } from './transitions.service';
import { PlacesModule } from '../places/places.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transition } from './entities/transition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transition]), PlacesModule],
  providers: [TransitionsService],
  exports: [TransitionsService],
})
export class TransitionsModule {}
