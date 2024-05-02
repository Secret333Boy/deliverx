import { IsOptional, IsUUID } from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsOptional()
  @IsUUID()
  attachedSortCenterId?: string;
}
