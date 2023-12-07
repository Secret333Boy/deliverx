import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { FlowEventDto } from './dto/flow-event.dto';
import { WorkerGuard } from '../users/guards/worker.guard';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(@Inject(EventsService) private eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, WorkerGuard)
  public async emitEvent(@Body() flowEventDto: FlowEventDto) {
    await this.eventsService.emitEvent(flowEventDto);
  }
}
