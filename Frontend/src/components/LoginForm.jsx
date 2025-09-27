import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { userLogin } from '../store/actions/auth.actions.js';
import { login, logout } from '../store/slices/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../ui/InputField.jsx';
import { useDispatch } from 'react-redux';
import Button from '../ui/Button.jsx';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GoogleLoginButton from './GoogleLoginButton.jsx';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: userLogin,
    onSuccess: (userData) => {
      if (userData) {
        localStorage.setItem('access', userData?.accessToken);
        localStorage.setItem('refresh', userData?.refreshToken);
        dispatch(login(userData));
        navigate('/');
        toast.success(userData?.message || 'Login Successfull');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="md:border min-w-md border-neutral-700 md:rounded-2xl p-12 md:p-8 sm:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-400">Welcome Back</h1>
        <p className="text-gray-500 mt-2">
          Sign in to your account or{' '}
          <Link to="/signup" className="text-pink-600 font-semibold hover:underline">
            signup
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <InputField
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <Button type="submit" isLoading={isPending}>
          Sign in
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="px-3 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      {/* 👇 Google Login Button */}
      <GoogleLoginButton />
    </div>
  );
}
