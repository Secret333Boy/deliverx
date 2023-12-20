import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlaceType } from '../entities/place-type.enum';

export class PatchPlaceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PlaceType)
  type?: PlaceType;

  @IsOptional()
  @IsNumber()
  lon?: number;

  @IsOptional()
  @IsNumber()
  lat?: number;
}
