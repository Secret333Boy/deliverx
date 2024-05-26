import { Button } from '@material-tailwind/react';
import React, { useLayoutEffect, useState } from 'react';
import { ApiService } from '../../services';
import { useNavigate } from 'react-router-dom';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';
import { User } from '../../types/user.entity';
import Table from '../../components/Table';

const AdminScreen = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState<User[]>([]);

  const loadWorkers = async () => {
    try {
      const { workers } = await ApiService.get<{ workers: User[] }>(
        `/users/workers`,
      );

      setWorkers(workers);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadWorkers();
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

  const deleteWorker = async (id: string) => {
    try {
      await ApiService.delete(`/users/workers/${id}`);
      await loadWorkers();
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
          <Button onClick={() => navigate('/worker/create')}>
            Create new worker
          </Button>
        </div>
      </div>

      <Table
        data={workers}
        headers={['Worker id', 'Full name', 'Role', 'Actions']}
        generateRow={(item) => [
          <>{item.id}</>,
          <>
            {item.firstName} {item.lastName}
          </>,
          <>{item.role}</>,
          <div className="flex justify-center items-center gap-2">
            <Button onClick={() => navigate(`/worker/${item.id}`)}>Show</Button>
            <Button onClick={() => deleteWorker(item.id)}>Delete</Button>
          </div>,
        ]}
      />
    </div>
  );
};

export default AdminScreen;
