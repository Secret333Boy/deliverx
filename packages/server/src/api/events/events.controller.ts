import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { FlowEventDto } from './dto/flow-event.dto';
import { WorkerGuard } from '../users/guards/worker.guard';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserData } from '../users/decorators/user-data.decorator';
import { User } from '../users/entities/user.entity';

@Controller('events')
export class EventsController {
  constructor(@Inject(EventsService) private eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, WorkerGuard)
  public async emitEvent(
    @UserData() user: User,
    @Body() flowEventDto: FlowEventDto,
  ) {
    await this.eventsService.emitEvent(user, flowEventDto);
  }
}
