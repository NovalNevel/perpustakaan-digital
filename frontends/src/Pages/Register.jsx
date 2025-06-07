import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import auth from "@/services/auth.jsx";
import { SmoothCursor } from '@/components/magicui/smooth-cursor.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = auth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    studyProgram: '',
    faculty: '',
    nim: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Lemah';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Kuat';
    return 'Sedang';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(formData.nim)) {
      toast.error('NIM harus berupa angka!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);

    const res = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.faculty,
      formData.studyProgram,
      formData.nim
    );

    setLoading(false);

    if (res.status && res.status !== 200) {
      toast.error(res.message || 'Registrasi gagal');
      return;
    }

    toast.success('Registrasi berhasil!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });

    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center px-4" style={{ backgroundImage: 'url("/images/bg_books.png")' }}>
      <SmoothCursor />
      <div className="flex flex-col md:flex-row max-w-3xl w-full bg-white/90 rounded-xl shadow-md overflow-hidden z-10 backdrop-blur-md">
        
        {/* Sidebar */}
        <div className="bg-[#002C4B] md:w-[42%] w-full flex flex-col justify-between items-center text-white px-4 py-4">
          <div className="w-full flex justify-start">
            <button onClick={() => navigate(-1)} className="hover:opacity-70 transition">
              <img src="/images/img_arrowleft.svg" alt="Kembali" className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center flex-grow">
            <img src="/images/Profil.png" alt="Profile" className="w-[90px] h-[90px] mt-6 mb-4" />
            <p className="text-lg font-semibold text-center">Pendaftaran Member</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:w-[58%] w-full bg-white p-6 flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold text-[#090446] mb-1 text-center">Pendaftaran Member</h1>
          <p className="text-sm text-[#090446] mb-2 text-center">Silakan isi data Anda dengan benar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center mt-1 w-full">
            <InputField
              label="Nama Lengkap"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoFocus
              required
              className="w-full max-w-xs"
              inputClassName="h-8 text-sm"
            />
            <InputField
              label="NIM"
              id="nim"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              required
              className="w-full max-w-xs"
              inputClassName="h-8 text-sm"
            />
            <InputField
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full max-w-xs"
              inputClassName="h-8 text-sm"
            />
            <InputField
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              toggleVisibility
              className="w-full max-w-xs"
              inputClassName="h-8 text-sm"
            />
            <div className="w-full max-w-xs text-sm text-gray-600 mt-[-6px] mb-1">
              Kekuatan Password:{' '}
              <span className={
                passwordStrength === 'Kuat' ? 'text-green-600 font-semibold' :
                passwordStrength === 'Sedang' ? 'text-yellow-600 font-semibold' :
                'text-red-600 font-semibold'
              }>
                {passwordStrength}
              </span>
            </div>
            <InputField
              label="Program Studi"
              id="studyProgram"
              name="studyProgram"
              value={formData.studyProgram}
              onChange={handleChange}
              required
              className="w-full max-w-xs"
              inputClassName="h-8 text-sm"
            />
            <InputField
              label="Fakultas"
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
              className="w-full max-w-xs"
              inputClassName="h-8 text-sm"
            />

            <Button
              type="submit"
              disabled={loading}
              size="large"
              variant="primary"
              className={`w-full max-w-xs mt-2 text-sm transform transition hover:scale-105 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {loading ? 'Mendaftarkan...' : 'Sign up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
