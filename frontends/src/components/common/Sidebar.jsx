import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="h-full w-full bg-[#002C4B] flex flex-col justify-between items-center text-white px-4 py-6">
      {/* Atas: Arrow & Foto */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <button onClick={handleBackClick} className="hover:opacity-70 transition">
            <img src="./public/images/img_arrowleft.svg" alt="Kembali" className="w-6 h-6" />
          </button>
        </div>
        <img src="./public/images/img_male_1.png" alt="Profile" className="w-[90px] h-[90px] mb-4" />
      </div>
      {/* Bawah: Text & Button */}
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-[20px] font-semibold text-white text-center mb-4">
          Belum Punya Akun?
        </h2>
        <button
          onClick={() => navigate('/register')}
          className="w-[180px] h-[40px] bg-[#FF002E] text-white text-base font-semibold rounded-md shadow-md border-4 border-white underline hover:bg-red-700 transition"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Sidebar;