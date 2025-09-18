import { useState } from 'react';
import { Mail, Lock, IdCard } from 'lucide-react';
import { userSignup } from '../store/actions/auth.actions';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/slices/authSlice';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { z } from 'zod';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: userSignup,
    onSuccess: (userData) => {
      if (userData) {
        localStorage.setItem('access', userData?.accessToken);
        localStorage.setItem('refresh', userData?.refreshToken);
        dispatch(login(userData));
        navigate('/');
        toast.success(userData?.message || 'Signup Successfull');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Signup failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = { name, email, password };
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const errors = z.treeifyError(result.error);
      setValidationError(errors);
      return;
    } else {
      setValidationError(null);
    }

    mutate(result.data);
  };

  return (
    <div className="w-full max-w-md mx-auto pt-32">
      <div className="border border-neutral-700 rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-400">Welcome</h1>
          <p className="text-gray-500 mt-2">
            Already have an account {' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              login
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name Field */}
          <div>
            <InputField
              type="text"
              placeholder="Your name"
              icon={IdCard}
              value={name}
              onChange={(e) => {
                setValidationError(null);
                setName(e.target.value);
              }}
              required
            />
            {validationError?.properties?.name?.errors?.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {validationError.properties.name.errors[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <InputField
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setValidationError(null);
                setEmail(e.target.value);
              }}
              required
            />
            {validationError?.properties?.email?.errors?.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {validationError.properties.email.errors[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setValidationError(null);
                setPassword(e.target.value);
              }}
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              required
            />
            {validationError?.properties?.password?.errors?.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {validationError.properties.password.errors[0]}
              </p>
            )}
          </div>

          <Button type="submit" isLoading={isPending}>
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
