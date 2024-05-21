import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ApiService } from '../services';
import { BackendRoute } from '../config';
import { HttpException } from '../exceptions';
import { useNavigate } from 'react-router-dom';

const INTERVAL_DELAY_TO_RECHECK = 60000; // 60s

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        await ApiService.get(BackendRoute.AUTH_VALIDATE);
        setIsAuthenticated(true);
      } catch (e) {
        if (e instanceof HttpException) {
          navigate('/login');
        } else throw e;
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();

    const interval = setInterval(validateAccess, INTERVAL_DELAY_TO_RECHECK);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading || !isAuthenticated) return <></>;

  return <>{children}</>;
};

export default AuthGuard;
