import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/auth-provider';

export const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/auth/login" replace />;
};
