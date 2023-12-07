import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EventType } from '../entities/event-type.enum';

export class FlowEventDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;

  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @IsUUID()
  @IsOptional()
  transitionId?: string;
}
