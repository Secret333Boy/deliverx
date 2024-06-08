import { Select, Option } from '@material-tailwind/react';
import React from 'react';
import { ApiService } from '../../services';
import { BackendRoute } from '../../config';

const mockAccounts = [
  { email: 'deliverx.admin@gmail.com', password: 'adminadmin', role: 'admin' },
  { email: 'alice@alice.com', password: 'alice@alice.com', role: 'depWorker' },
  { email: 'bob@bob.com', password: 'bob@bob.com', role: 'sortWorker' },
  { email: 'fread@fread.com', password: 'fread@fread.com', role: 'driver' },
];

const AccountPicker = () => {
  const handleChangeAccount = async (email?: string) => {
    if (!email) return;

    const account = mockAccounts.find((acc) => acc.email === email);
    if (!account) return;

    const { accessToken } = await ApiService.post<{ accessToken: string }>(
      BackendRoute.AUTH_LOGIN,
      {
        email: account.email,
        password: account.password,
      },
    );

    localStorage.setItem('accessToken', accessToken);
    window.location.replace('http://' + window.location.host);
  };

  return (
    <div className="absolute z-10 bottom-[300px] left-[10px]">
      <Select onChange={handleChangeAccount} label="Change account">
        {mockAccounts.map((account) => (
          <Option value={account.email}>
            {account.email} ({account.role})
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default AccountPicker;
