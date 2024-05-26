import React, { useLayoutEffect, useState } from 'react';
import { ApiService } from '../../services';
import { HttpException } from '../../exceptions';
import { toast } from 'react-toastify';
import { User } from '../../types/user.entity';
import { Role } from '../../types/role.enum';
import CustomerScreen from '../CustomerScreen';
import ChooseScreen from '../ChooseScreen';
import WorkerScreen from '../WorkerScreen';
import { useParams } from 'react-router-dom';

const Home = () => {
  const { screen } = useParams();

  const [user, setUser] = useState<User>();

  const loadUser = async () => {
    try {
      const account = await ApiService.get<User>('/users');

      setUser(account);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadUser();
  }, []);

  if (!user) return <></>;

  if (user.role === Role.USER || screen === 'user') return <CustomerScreen />;

  if (screen === 'worker') return <WorkerScreen user={user} />;

  return <ChooseScreen />;
};

export default Home;
