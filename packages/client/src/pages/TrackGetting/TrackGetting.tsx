import { Button, Input } from '@material-tailwind/react';
import React, { useState } from 'react';
import { ApiService } from '../../services';
import { useNavigate } from 'react-router-dom';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';

const TrackGetting = () => {
  const navigate = useNavigate();

  const [invoiceId, setInvoiceId] = useState('');

  const handleTrackGetting = async () => {
    try {
      await ApiService.post(`/events`, {
        invoiceId,
        type: 'got',
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
      <Button onClick={handleTrackGetting}>Track Getting</Button>
    </div>
  );
};

export default TrackGetting;
