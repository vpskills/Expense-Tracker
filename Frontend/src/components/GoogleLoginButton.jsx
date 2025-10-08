import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login, logout } from '../store/slices/authSlice';
import { googleLoginAction } from '../store/actions/auth.actions';
import { FcGoogle } from 'react-icons/fc';
import Button from '../ui/Button';
import useNetworkStatus from '../hooks/useNetworkStatus';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleWindowLoad, setGoogleWindowLoad] = useState(false);
  const isOnline = useNetworkStatus();
  

  const { mutate, isPending } = useMutation({
    mutationFn: googleLoginAction,
    onSuccess: (userData) => {
      if (userData) {
        localStorage.setItem('access', userData?.accessToken);
        localStorage.setItem('refresh', userData?.refreshToken);
        dispatch(login(userData?.user));
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
    setGoogleWindowLoad(false);
    if (credentialResponse?.credential) {
      mutate({ credential: credentialResponse.credential });
    } else {
      toast.error('No Google credential received');
    }
  };

  return (
    <div className="flex justify-center relative">
      {/* hidden button */}
      <div 
        className="absolute w-full border inset-0 opacity-0 pointer-events-auto"
        onClick={()=> {
          !isOnline ? toast.error('You are offline!') : setGoogleWindowLoad(true);
        }} 
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            setGoogleWindowLoad(false);
            toast.error('Google Login Failed!');
          }}
        />
      </div>
      
      {/* visible button */}
      <Button isLoading={isPending || googleWindowLoad} disable={isPending} className="gap-2 bg-white shadow hover:bg-gray-200 pointer-events-none">
        <FcGoogle size={20} />
        <span className="font-medium text-gray-700">Continue with Google</span>
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
