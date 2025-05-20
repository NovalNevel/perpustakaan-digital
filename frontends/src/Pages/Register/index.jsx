import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import Header from '../../components/common/Header';
import { FlickeringGrid } from '../../components/magicui/flickering-grid';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    nim: '',
    email: '',
    password: '',
    jurusan: '',
    fakultas: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Background FlickeringGrid */}
      <div className="absolute inset-0 -z-10">
        <FlickeringGrid squareSize={8} />
      </div>

      {/* Container Register */}
      <div className="flex max-w-5xl w-full h-full bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
        <div className="w-1/2 h-full">
          <Sidebar />
        </div>

        <div className="w-1/2 bg-white p-12 h-full flex flex-col justify-center">
          <Header className="-mt-6 mb-4" />
          <h1 className="text-4xl font-bold text-[#090446] mb-2">Register Account</h1>
          <p className="text-lg text-[#090446] mb-6">Pendaftaran Member</p>
          
      <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col items-center space-y-2">
      <InputField label="Nama Lengkap" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-9" />
      <InputField label="NIM" id="nim" name="nim" value={formData.nim} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-9" />
      <InputField label="Email" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-9" />
      <InputField label="Password" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required toggleVisibility className="w-full max-w-xs" inputClassName="h-9" />
      <InputField label="Jurusan" id="jurusan" name="jurusan" value={formData.jurusan} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-9" />
      <InputField label="Fakultas" id="fakultas" name="fakultas" value={formData.fakultas} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-9" />
      <Button type="submit" size="large" variant="primary" className="w-full max-w-xs bg-red-600 text-white">Sign up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
