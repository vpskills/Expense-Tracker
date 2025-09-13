import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children, authenticate = true }) => {
  const authStatus = useSelector((state) => state.auth?.status);
  console.log(authStatus, 'asdf')
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticate && !authStatus) {
      navigate("/login");
    } else if (!authenticate && authStatus) {
      navigate("/");
    }
  }, [navigate, authStatus, authenticate]);

  return <>{children}</>;
};

export default AuthWrapper;
