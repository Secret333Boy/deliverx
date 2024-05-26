import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiService } from '../../services';
import { Invoice } from '../../types/invoice.entity';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';
import { Event } from '../../types/event.entity';

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<Invoice>();
  const [invoiceEvents, setInvoiceEvents] = useState<Event[]>([]);

  const loadInvoice = async () => {
    try {
      const invoice = await ApiService.get<Invoice>('/invoices/' + id);
      setInvoice(invoice);

      const invoiceEvents = await ApiService.get<Event[]>(
        `/invoices/${id}/events`,
      );
      setInvoiceEvents(invoiceEvents);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadInvoice();
  }, []);

  if (!invoice) return <>Loading...</>;

  return (
    <div>
      <div>Invoice {invoice.id}</div>
      <div>
        {invoice.senderDepartment.name} {'->'} {invoice.receiverDepartment.name}
      </div>

      <div className="flex">
        <div className="w-full">
          <div>Description: {invoice.description}</div>
          <hr />
          <div>Sender:</div>
          <div>Department: {invoice.senderDepartment.name}</div>
          <div>Full name: {invoice.senderFullName}</div>
          <hr />
          <div>Receiver:</div>
          <div>Department: {invoice.receiverDepartment.name}</div>
          <div>Full name: {invoice.receiverFullName}</div>
          <div>Email: {invoice.receiverEmail}</div>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-2">
            {invoiceEvents.map((event) => (
              <div key={`event-${event.id}`}>
                {event.type} ({event.time}){' '}
                {event.journey
                  ? `[${event.journey.transition.sourcePlace.name} -> ${event.journey.transition.targetPlace.name}]`
                  : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
