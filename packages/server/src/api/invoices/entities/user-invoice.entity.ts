import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserInvoice {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  invoiceId: string;
}
