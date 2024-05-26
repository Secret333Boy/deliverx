import { Button, Input } from '@material-tailwind/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services';
import { toast } from 'react-toastify';
import { HttpException } from '../../exceptions';

const Register = () => {
  const navigate = useNavigate();

  const [registerDto, setRegisterDto] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleRegister = async () => {
    try {
      const { accessToken } = await ApiService.post<{ accessToken: string }>(
        '/auth/register',
        registerDto,
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
        onClick={() => navigate('/login')}
      >
        To Login
      </Button>
      <div className="max-w-[300px] w-full flex flex-col gap-2">
        <Input
          value={registerDto.email}
          onChange={(e) =>
            setRegisterDto({ ...registerDto, email: e.target.value })
          }
          crossOrigin={''}
          type="email"
          label="email"
        />
        <Input
          value={registerDto.firstName}
          onChange={(e) =>
            setRegisterDto({ ...registerDto, firstName: e.target.value })
          }
          crossOrigin={''}
          label="first name"
        />
        <Input
          value={registerDto.lastName}
          onChange={(e) =>
            setRegisterDto({ ...registerDto, lastName: e.target.value })
          }
          crossOrigin={''}
          label="last name"
        />
        <Input
          value={registerDto.password}
          onChange={(e) =>
            setRegisterDto({ ...registerDto, password: e.target.value })
          }
          crossOrigin={''}
          type="password"
          label="password"
        />
        {/* <Input
          value={registerDto.email}
          onChange={(e) =>
            setRegisterDto({ ...registerDto, email: e.target.value })
          }
          crossOrigin={''}
          label="repeat your password"
        /> */}
        <Button className="w-full" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </div>
  );
};

export default Register;
