import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../users/guards/role.guard';
import { Role } from '../users/entities/role.enum';
import { JourneysService } from './journeys.service';
import { UserData } from '../users/decorators/user-data.decorator';
import { User } from '../users/entities/user.entity';

@Controller('journeys')
export class JourneysController {
  constructor(
    @Inject(JourneysService) private journeysService: JourneysService,
  ) {}

  @Get('/ongoing')
  @UseGuards(JwtAuthGuard, new RoleGuard([Role.DRIVER]))
  public async getOngoingJourneys(
    @UserData() user: User,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.journeysService.getOngoingJourneys(
      user,
      +take || 100,
      +skip || 0,
    );
  }

  @Patch('/:id/start')
  @UseGuards(JwtAuthGuard, new RoleGuard([Role.DRIVER]))
  public async startJourney(
    @UserData() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.journeysService.startJourney(user, id);
  }
}
