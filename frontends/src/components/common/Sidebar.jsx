import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="h-full w-full bg-[#012E4A] flex flex-col justify-between py-10 px-10 font-poppins">
      
      {/* Bagian atas: tombol kembali dan avatar */}
      <div className="relative flex flex-col items-center">
        {/* Tombol back */}
        <button
          onClick={handleBackClick}
          className="absolute top-0 left-0 text-white hover:text-gray-300"
          aria-label="Go back"
        >
          <img src="./public/images/img_arrowleft.svg" alt="Back" className="w-7 h-7" />
        </button>

        {/* Gambar profil */}
        <img
          src="./public/images/img_male_1.png"
          alt="Profile"
          className="w-[160px] h-[160px] mt-12 mb-6"
        />
      </div>

      {/* Bagian bawah: teks & tombol */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-[24px] font-semibold text-white text-center mb-6">
          Belum Punya Akun?
        </h2>

        <button
          onClick={() => navigate('/register')}
          className="w-[450px] h-[80px] bg-[#FF002E] text-white text-[28px] font-semibold rounded-md shadow-md border-4 border-white underline hover:bg-red-700 transition"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
