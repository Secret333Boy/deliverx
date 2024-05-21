import { Button, Input } from '@material-tailwind/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <Button
        className="!absolute top-0 right-0"
        onClick={() => navigate('/register')}
      >
        To Register
      </Button>
      <div className="max-w-[300px] w-full flex flex-col gap-2">
        <Input crossOrigin={''} label="email" />
        <Input crossOrigin={''} label="password" />
        <Button className="w-full" onClick={() => {}}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
