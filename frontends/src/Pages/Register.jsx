import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { FlickeringGrid } from '../components/magicui/flickering-grid';

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
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("/images/bg_books.png")' }}>
        {/* Card */}
        <div className="flex max-w-3xl w-full min-h-[360px] bg-white/90 rounded-xl shadow-md overflow-hidden z-10 backdrop-blur-md">
          {/* Sidebar */}
          <div className="bg-[#002C4B] w-[42%] flex flex-col justify-between items-center text-white px-4 py-4">
            {/* Arrow */}
            <div className="w-full flex justify-start">
              <button onClick={() => navigate(-1)} className="hover:opacity-70 transition">
                <img src="/images/img_arrowleft.svg" alt="Kembali" className="w-6 h-6" />
              </button>
            </div>
            {/* Tengah */}
            <div className="flex flex-col justify-center items-center flex-grow -mt-4">
              <img src="/images/Profil.png" alt="Profile" className="w-[90px] h-[90px] mt-6 mb-4" />
              <p className="text-lg font-semibold text-center">Pendaftaran Member</p>
            </div>
          </div>

          {/* Form */}
          <div className="w-[58%] bg-white p-4 flex flex-col justify-center items-center">
            <h1 className="text-xl font-bold text-[#090446] mb-1 text-center">Register Account</h1>
            <p className="text-sm text-[#090446] mb-2 text-center">Pendaftaran Member</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center mt-1 w-full">
              <InputField label="Nama Lengkap" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-8 text-sm" />
              <InputField label="NIM" id="nim" name="nim" value={formData.nim} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-8 text-sm" />
              <InputField label="Email" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-8 text-sm" />
              <InputField label="Password" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required toggleVisibility className="w-full max-w-xs" inputClassName="h-8 text-sm" />
              <InputField label="Jurusan" id="jurusan" name="jurusan" value={formData.jurusan} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-8 text-sm" />
              <InputField label="Fakultas" id="fakultas" name="fakultas" value={formData.fakultas} onChange={handleChange} required className="w-full max-w-xs" inputClassName="h-8 text-sm" />
              <Button
                type="submit"
                size="large"
                variant="primary"
                className="w-full max-w-xs bg-red-600 text-white mt-2 text-sm hover:bg-red-700 transition transform hover:scale-105"
              >
                Sign up
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
