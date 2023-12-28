import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlacesController } from './places.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  providers: [PlacesService],
  exports: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
