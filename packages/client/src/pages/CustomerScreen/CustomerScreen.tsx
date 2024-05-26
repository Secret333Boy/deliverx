import React, { FC, useLayoutEffect, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { ApiService } from '../../services';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';
import { Invoice } from '../../types/invoice.entity';
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';

const CustomerScreen: FC = () => {
  const navigate = useNavigate();

  const [trackedInvoices, setTrackedInvoices] = useState<Invoice[]>([]);

  const loadTrackedInvoices = async () => {
    try {
      const { invoices } = await ApiService.get<{
        invoices: Invoice[];
        totalPages: number;
      }>('/invoices/tracked');

      setTrackedInvoices(invoices);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  const logout = async () => {
    try {
      await ApiService.delete(`/auth/logout`);
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  const untrackInvoice = async (id: string) => {
    try {
      await ApiService.delete(`/invoices/${id}/untrack`);
      await loadTrackedInvoices();
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadTrackedInvoices();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <Button onClick={logout}>Logout</Button>

        <div className="flex items-center gap-2">
          <Button>Track by invoice</Button>
          <Button onClick={() => navigate('/create-invoice')}>
            Create invoice
          </Button>
        </div>
      </div>

      <Table
        data={trackedInvoices}
        headers={['Invoice id', 'Route', 'Status', 'Actions']}
        generateRow={(item) => [
          <>{item.id}</>,
          <>
            {item.senderDepartment.name} {'->'} {item.receiverDepartment.name}
          </>,
          <>{item.id}</>,
          <div className="flex justify-center items-center gap-2">
            <Button onClick={() => navigate(`/invoice/${item.id}`)}>
              Show
            </Button>
            <Button onClick={() => untrackInvoice(item.id)}>Delete</Button>
          </div>,
        ]}
      />
    </div>
  );
};

export default CustomerScreen;
