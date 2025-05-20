import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import InputField from '../../components/ui/InputField';
import Checkbox from '../../components/ui/Checkbox';
import Button from '../../components/ui/Button';
import { Globe } from '../../components/magicui/globe';
import auth from "../../services/auth";
import { FlickeringGrid } from '../../components/magicui/flickering-grid';
import {toast} from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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

    try {
      const response = await login(formData.email, formData.password);
      if (response?.token) { // Check for a token or other success indicator
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        navigate("/"); // Redirect to the dashboard
      } else {
        throw new Error(response?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
  <div className="relative flex h-screen items-center justify-center overflow-hidden">
    {/* Background FlickeringGrid */}
    <div className="absolute inset-0 -z-10">
      <FlickeringGrid squareSize={8} />
    </div>

    {/* Container Login */}
    <div className="flex max-w-5xl w-full h-full bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
      <div className="w-1/2 h-full">
        <Sidebar />
      </div>
      <div className="w-1/2 bg-white p-12 h-full flex flex-col justify-center">
        <Header/>
        <h1 className="text-4xl font-bold text-[#090446] mb-2">Login Member</h1>
        <p className="text-lg text-[#090446] mb-6">Sign in to continue your progress</p>
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
          {/*<div className="flex items-center justify-end">
            <Checkbox
              id="showPassword"
              name="showPassword"
              label="Show password"
              checked={showPassword}
              onChange={toggleShowPassword}
            />
          </div>*/}
          <Button type="submit" variant="primary" size="large" className="w-full bg-red-600 text-white">Sign in</Button>
        </form>
      </div>
    </div>
  </div>
);
};

export default LoginPage;
