import { Input, Select, Option, Button } from '@material-tailwind/react';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Role } from '../../types/role.enum';
import { Place } from '../../types/place.entity';
import { ApiService } from '../../services';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';
import { User } from '../../types/user.entity';

const WorkerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isCreating = id === 'create';

  const [worker, setWorker] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: '',
    placeId: '',
  });

  const [places, setPlaces] = useState<Place[]>([]);

  const loadPlaces = async () => {
    try {
      const { places } = await ApiService.get<{ places: Place[] }>('/places');

      setPlaces(places);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  const handleLoadWorker = async () => {
    if (isCreating) return;

    try {
      const user = await ApiService.get<User>(`/users/workers/${id}`);

      setWorker({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',
        placeId: user.place?.id || '',
        role: user.role,
      });
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadPlaces();
    handleLoadWorker();
  }, []);

  const handleSaveWorker = async () => {
    const workerDto = {
      ...worker,
      placeId: worker.placeId || undefined,
      password: worker.password || undefined,
    };

    if (!workerDto.password) delete workerDto.password;
    if (!workerDto.placeId) delete workerDto.placeId;

    try {
      if (isCreating) {
        await ApiService.post('/users/workers', workerDto);
        navigate('/worker');
        return;
      }

      await ApiService.patch(`/users/workers/${id}`, workerDto);
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
      {!isCreating && <div>Worker {id}</div>}

      <Input
        value={worker.email}
        onChange={(e) => setWorker({ ...worker, email: e.target.value })}
        type="Email"
        label="Email"
        crossOrigin={''}
      />
      <Input
        value={worker.firstName}
        onChange={(e) => setWorker({ ...worker, firstName: e.target.value })}
        label="First name"
        crossOrigin={''}
      />
      <Input
        value={worker.lastName}
        onChange={(e) => setWorker({ ...worker, lastName: e.target.value })}
        label="Last name"
        crossOrigin={''}
      />
      <Select
        value={worker.role}
        onChange={(value) =>
          setWorker({ ...worker, role: value || worker.role })
        }
        label="Role"
      >
        {Object.values(Role)
          .filter((item) => item !== 'user')
          .map((item) => (
            <Option key={`role-${item}`} value={item}>
              {item}
            </Option>
          ))}
      </Select>
      <Input
        value={worker.password}
        onChange={(e) => setWorker({ ...worker, password: e.target.value })}
        type="Password"
        label="Password"
        crossOrigin={''}
      />
      {places.length > 0 && (
        <Select
          value={worker.placeId}
          onChange={(value) =>
            setWorker({ ...worker, placeId: value || worker.placeId })
          }
          label="Place"
        >
          {places.map((item) => (
            <Option key={`place-${item.id}`} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      )}

      <Button onClick={handleSaveWorker}>Save worker</Button>
    </div>
  );
};

export default WorkerDetails;
