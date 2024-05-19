import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

  public async sendEmail(to: string, text: string, html: string) {
    return this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      subject: 'DeliverX Notification',
      to,
      text,
      html,
    });
  }
}
