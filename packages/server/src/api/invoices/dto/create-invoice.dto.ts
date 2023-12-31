import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  senderDepartmentId: number;

  @IsString()
  @IsNotEmpty()
  senderFullName: string;

  @IsNumber()
  @IsNotEmpty()
  receiverDepartmentId: number;

  @IsString()
  @IsNotEmpty()
  receiverFullName: string;

  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;
}
