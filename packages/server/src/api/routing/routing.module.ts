import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { TransitionsModule } from '../transitions/transitions.module';
import { AStarPathFinder } from './a-star-path-finder';

@Module({
  imports: [TransitionsModule],
  providers: [RoutingService, AStarPathFinder],
})
export class RoutingModule {}
