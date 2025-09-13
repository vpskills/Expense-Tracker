import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { userLogin } from "../store/actions/auth.actions.js";
import { login, logout } from "../store/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../ui/InputField.jsx";
import { useDispatch } from "react-redux";
import Button from "../ui/Button.jsx";
import { useMutation } from "@tanstack/react-query";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: userLogin,
    onSuccess: (userData) => {
      if (userData) {
        dispatch(login(userData));
        navigate("/");
      } else {
        dispatch(logout());
        alert("Getting user details failed!");
        navigate("/login");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="w-full max-w-md mx-auto pt-32">
      <div className="border border-neutral-700 rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-400">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Sign in to your account or{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
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
            type={showPassword ? "text" : "password"}
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
      </div>
    </div>
  );
}