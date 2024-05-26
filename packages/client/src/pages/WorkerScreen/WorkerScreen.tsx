import React, { FC } from 'react';
import { User } from '../../types/user.entity';
import { Role } from '../../types/role.enum';
import AdminScreen from '../AdminScreen';
import DepWorkerScreen from '../DepWorkerScreen';
import SortWorkerScreen from '../SortWorkerScreen';
import DriverScreen from '../DriverScreen';

interface WorkerScreenProps {
  user: User;
}

const WorkerScreen: FC<WorkerScreenProps> = ({ user }) => {
  if (user.role === Role.ADMIN) return <AdminScreen />;
  if (user.role === Role.DEPARTMENT_WORKER) return <DepWorkerScreen />;
  if (user.role === Role.SORT_CENTER_WORKER) return <SortWorkerScreen />;
  if (user.role === Role.DRIVER) return <DriverScreen />;

  return <>WorkerScreen</>;
};

export default WorkerScreen;
