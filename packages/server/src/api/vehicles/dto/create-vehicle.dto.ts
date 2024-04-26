import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsUUID()
  driverId: string;

  @IsOptional()
  @IsUUID()
  attachedSortCenterId?: string;
}
