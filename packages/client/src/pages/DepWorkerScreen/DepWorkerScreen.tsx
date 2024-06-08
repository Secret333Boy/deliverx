import { Button } from '@material-tailwind/react';
import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { HttpException } from '../../exceptions';
import { ApiService } from '../../services';
import { useNavigate } from 'react-router-dom';
import { Invoice } from '../../types/invoice.entity';
import Table from '../../components/Table';

const DepWorkerScreen = () => {
  const navigate = useNavigate();

  const [inplaceInvoices, setInplaceInvoices] = useState<Invoice[]>([]);

  const loadInplaceInvoices = async () => {
    try {
      const { invoices } = await ApiService.get<{ invoices: Invoice[] }>(
        `/invoices/inplace`,
      );

      setInplaceInvoices(invoices);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadInplaceInvoices();
  }, []);

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
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <Button onClick={logout}>Logout</Button>

        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/track/getting')}>
            Track getting
          </Button>
          <Button onClick={() => navigate('/track/giving')}>
            Track giving
          </Button>
        </div>
      </div>

      <Table
        data={inplaceInvoices}
        headers={['Invoice id', 'Actions']}
        generateRow={(item) => [
          <>{item.id}</>,
          <div className="flex justify-center items-center gap-2">
            <Button onClick={() => navigate(`/invoice/${item.id}`)}>
              Show
            </Button>
          </div>,
        ]}
      />
    </div>
  );
};

export default DepWorkerScreen;
