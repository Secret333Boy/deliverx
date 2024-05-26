import { Button } from '@material-tailwind/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center gap-2">
      <Button onClick={() => navigate('/user')}>Enter customer screen</Button>
      <Button onClick={() => navigate('/worker')}>Enter worker screen</Button>
    </div>
  );
};

export default ChooseScreen;
