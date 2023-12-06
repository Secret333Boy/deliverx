import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  senderDepartmentId: string;

  @IsString()
  @IsNotEmpty()
  senderFullName: string;

  @IsUUID()
  @IsNotEmpty()
  receiverDepartmentId: string;

  @IsString()
  @IsNotEmpty()
  receiverFullName: string;

  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsBoolean()
  @IsNotEmpty()
  fragile: boolean;
}
