import { Button } from '@material-tailwind/react';
import React, { FC } from 'react';

interface ChooseScreenProps {
  setChosenScreen: (value: 'worker' | 'user') => void;
}

const ChooseScreen: FC<ChooseScreenProps> = ({ setChosenScreen }) => {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-2">
      <Button onClick={() => setChosenScreen('user')}>
        Enter customer screen
      </Button>
      <Button onClick={() => setChosenScreen('worker')}>
        Enter worker screen
      </Button>
    </div>
  );
};

export default ChooseScreen;
