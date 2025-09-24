import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';

const AuthWrapper = ({ children, authenticate = true }) => {
  const authStatus = useSelector((state) => state.auth?.status);
  const isInitializing = useSelector((state) => state.auth?.isInitializing);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;

    if (authenticate && !authStatus) {
      navigate('/login');
    } else if (!authenticate && authStatus) {
      navigate('/');
    }
  }, [navigate, authStatus, authenticate, isInitializing]);

  if (isInitializing) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-gray-400 bg-neutral-900">
        <CircleLoader color="white" />
        <h2>Checking session</h2>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
