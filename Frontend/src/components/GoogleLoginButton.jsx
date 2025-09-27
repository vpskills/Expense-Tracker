import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login, logout } from '../store/slices/authSlice';
import { googleLoginAction } from '../store/actions/auth.actions';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: googleLoginAction,
    onSuccess: (userData) => {
      if (userData) {
        localStorage.setItem('access', userData?.accessToken);
        localStorage.setItem('refresh', userData?.refreshToken);
        dispatch(login(userData));
        navigate('/');
        toast.success(userData?.message || 'Login successful');
      } else {
        dispatch(logout());
        toast.error('Getting user details failed!');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed!');
      console.error('Login failed:', error);
    },
  });

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse?.credential) {
      mutate({ credential: credentialResponse.credential });
    } else {
      toast.error('No Google credential received');
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error('Google Login Failed')}
      />
    </div>
  );
};

export default GoogleLoginButton;
