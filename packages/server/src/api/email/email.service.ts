import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  constructor() {}

  public sendEmail(to: string, text: string, html: string) {
    this.transporter.sendMail({ from: process.env.EMAIL_USER, to, text, html });
  }
}
