import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  senderDepartmentId: string;

  @IsString()
  @IsNotEmpty()
  senderFullName: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  receiverDepartmentId: string;

  @IsString()
  @IsNotEmpty()
  receiverFullName: string;

  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;
}
