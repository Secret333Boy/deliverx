import { Input, Button } from '@material-tailwind/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HttpException } from '../../exceptions';
import { ApiService } from '../../services';

const TrackGiving = () => {
  const navigate = useNavigate();

  const [invoiceId, setInvoiceId] = useState('');

  const handleTrackGiving = async () => {
    try {
      await ApiService.post(`/events`, {
        invoiceId,
        type: 'given',
      });

      navigate('/worker');
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
      <Input
        label="Invoice ID"
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        crossOrigin={''}
      />
      <Button onClick={handleTrackGiving}>Track giving</Button>
    </div>
  );
};

export default TrackGiving;
