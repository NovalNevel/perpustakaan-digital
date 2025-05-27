import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
// import { FlickeringGrid } from '../../components/magicui/flickering-grid';
// import auth from '../../services/auth'; // Comment auth
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  // const { login } = auth(); // Comment auth

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

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

    // Simulasi login sukses, langsung redirect ke dashboard
    // try {
    //   const response = await login(formData.email, formData.password);
    //   if (response?.token) {
    //     toast.success('Login successful!');
    //     navigate('/');
    //   } else {
    //     throw new Error(response?.message || 'Login failed');
    //   }
    // } catch (error) {
    //   toast.error(error.message || 'An error occurred during login');
    // }
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
    <div className="flex max-w-5xl w-full rounded-xl shadow-2xl backdrop-blur-md bg-white/90 overflow-hidden relative z-10">
      {/* Kiri */}
      <div className="w-1/2 bg-[#002C4B] text-white flex flex-col justify-between items-center p-8">
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex justify-start mb-4">
            <button onClick={handleBackClick} className="hover:opacity-70 transition">
              <img
                src="/images/img_arrowleft.svg"
                alt="Kembali"
                className="w-6 h-6"
              />
            </button>
          </div>
          <img
            src="/images/img_male_1.png"
            alt="Profile"
            className="w-[90px] h-[90px] mb-4"
          />
        </div>

        <div className="flex flex-col items-center mb-2">
          <h2 className="text-[20px] font-semibold text-white text-center mb-4">
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
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-[#090446] mb-2">
          Login Member
        </h1>
        <p className="text-lg text-[#090446] mb-6">
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