import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  providers: [PlacesService],
})
export class PlacesModule {}
