import { Button, Input } from '@material-tailwind/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services';
import { BackendRoute } from '../../config';
import { toast } from 'react-toastify';
import { HttpException } from '../../exceptions';

const Login = () => {
  const navigate = useNavigate();

  const [loginDto, setLoginDto] = useState({
    email: '',
    password: '',
  });

  const onLoginClick = async () => {
    try {
      const { accessToken } = await ApiService.post<{ accessToken: string }>(
        BackendRoute.AUTH_LOGIN,
        loginDto,
      );

      localStorage.setItem('accessToken', accessToken);

      navigate('/');
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <Button
        className="!absolute top-0 right-0"
        onClick={() => navigate('/register')}
      >
        To Register
      </Button>
      <div className="max-w-[300px] w-full flex flex-col gap-2">
        <Input
          type="email"
          value={loginDto.email}
          onChange={(e) => setLoginDto({ ...loginDto, email: e.target.value })}
          crossOrigin={''}
          label="email"
        />
        <Input
          type="password"
          value={loginDto.password}
          onChange={(e) =>
            setLoginDto({ ...loginDto, password: e.target.value })
          }
          crossOrigin={''}
          label="password"
        />
        <Button className="w-full" onClick={onLoginClick}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
