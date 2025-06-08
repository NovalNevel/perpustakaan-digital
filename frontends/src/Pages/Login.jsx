import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import auth from '../services/auth';
import { toast } from 'react-toastify';
import { SmoothCursor } from '@/components/magicui/smooth-cursor';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = auth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await login(formData.email, formData.password);
    if (res.status && res.status !== 200) {
      toast.error(res.message || 'Login gagal');
      return;
    }

    toast.success('Login successful!');
    navigate('/dashboard');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/bg_books.png")' }}
    >
      <SmoothCursor />
      <div className="flex flex-col sm:flex-row w-full max-w-5xl rounded-xl shadow-2xl backdrop-blur-md bg-white/90 overflow-hidden relative z-10 m-4">
        {/* Kiri */}
        <div className="w-full sm:w-1/2 bg-[#002C4B] text-white flex flex-col justify-between items-center p-6 sm:p-8">
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-start mb-4">
              <button onClick={handleBackClick} className="hover:opacity-70 transition">
                <img src="/images/img_arrowleft.svg" alt="Kembali" className="w-6 h-6" />
              </button>
            </div>
            <img src="/images/Profil.png" alt="Profile" className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] mb-4" />
          </div>

          <div className="flex flex-col items-center mb-2 w-full">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-white text-center mb-4">
              Belum Punya Akun?
            </h2>
            <Button
              onClick={() => navigate('/register')}
              size="large"
              variant="primary"
              className="w-full max-w-xs bg-red-600 text-white mt-2 text-sm hover:bg-red-700 transition transform hover:scale-105 shadow-lg"
            >
              Sign up
            </Button>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-full sm:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#090446] mb-2 text-center sm:text-left">
            Login Member
          </h1>
          <p className="text-sm sm:text-lg text-[#090446] mb-6 text-center sm:text-left">
            Sign in to continue your progress
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />
            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
              toggleVisibility={true}
            />
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full bg-red-600 text-white hover:bg-red-700 transition transform hover:scale-105 hover:shadow-lg"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
