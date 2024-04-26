import { IsOptional, IsUUID } from 'class-validator';

export class CreateVehicleDto {
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsOptional()
  @IsUUID()
  attachedSortCenterId?: string;
}
