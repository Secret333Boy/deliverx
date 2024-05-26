import {
  Button,
  Checkbox,
  Input,
  Select,
  Option,
  Textarea,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Place } from '../../types/place.entity';
import { ApiService } from '../../services';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [createInvoiceDto, setCreateInvoiceDto] = useState({
    description: '',
    senderDepartmentId: '',
    senderFullName: '',
    receiverDepartmentId: '',
    receiverFullName: '',
    receiverEmail: '',
  });

  const [possibleDepartments, setPossibleDepartments] = useState<Place[]>([]);

  const loadDepartments = async () => {
    try {
      const { places } = await ApiService.get<{ places: Place[] }>(
        '/places/departments',
      );

      setPossibleDepartments(places);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreateInvoice = async () => {
    try {
      await ApiService.post('/invoices', createInvoiceDto);
      navigate('/user');
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
      <Textarea
        value={createInvoiceDto.description}
        onChange={(e) =>
          setCreateInvoiceDto({
            ...createInvoiceDto,
            description: e.target.value,
          })
        }
        label="Description"
      />

      <div>Sender:</div>

      <Select
        label="Sender department"
        value={createInvoiceDto.senderDepartmentId}
        onChange={(value) => {
          setCreateInvoiceDto({
            ...createInvoiceDto,
            senderDepartmentId: value || '',
          });
        }}
      >
        {possibleDepartments.map((possibleDepartment) => (
          <Option
            value={possibleDepartment.id}
            key={`sender-department-${possibleDepartment.id}`}
          >
            {possibleDepartment.name}
          </Option>
        ))}
      </Select>
      <Input
        label="Full name"
        value={createInvoiceDto.senderFullName}
        onChange={(e) =>
          setCreateInvoiceDto({
            ...createInvoiceDto,
            senderFullName: e.target.value,
          })
        }
        crossOrigin={''}
      />
      <Input label="Email" disabled crossOrigin={''} />

      <div>Receiver:</div>

      <Select
        label="Receiver department"
        value={createInvoiceDto.receiverDepartmentId}
        onChange={(value) =>
          setCreateInvoiceDto({
            ...createInvoiceDto,
            receiverDepartmentId:
              value || createInvoiceDto.receiverDepartmentId,
          })
        }
      >
        {possibleDepartments.map((possibleDepartment) => (
          <Option
            value={possibleDepartment.id}
            key={`receiver-department-${possibleDepartment.id}`}
          >
            {possibleDepartment.name}
          </Option>
        ))}
      </Select>
      <Input
        label="Full name"
        value={createInvoiceDto.receiverFullName}
        onChange={(e) =>
          setCreateInvoiceDto({
            ...createInvoiceDto,
            receiverFullName: e.target.value,
          })
        }
        crossOrigin={''}
      />
      <Input
        label="Email"
        value={createInvoiceDto.receiverEmail}
        onChange={(e) =>
          setCreateInvoiceDto({
            ...createInvoiceDto,
            receiverEmail: e.target.value,
          })
        }
        crossOrigin={''}
      />

      <div>Additional Info:</div>

      <div className="max-w-[300px]">
        <Checkbox label="fragile" crossOrigin={''} />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCreateInvoice}>Create invoice</Button>
      </div>
    </div>
  );
};

export default CreateInvoice;
