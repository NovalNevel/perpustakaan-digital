import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Data statis sementara
const books = [
  { title: 'How Deal With Very Bad BOOK', image: '/images/Book/Book1.png' },
  { title: 'The Hidden Mystery Behind', image: '/images/Book/Book2.png' },
  { title: 'Detektif Conan', image: '/images/Book/Book3.png' },
  { title: 'Flovely And Unicorn Erna', image: '/images/Book/Book4.png' },
  { title: 'Simple Things You To Save BOOK', image: '/images/Book/Book5.png' },
];

const categories = ['Terbaru', 'Populer', 'Sains', 'Seni dan Desain', 'Sastra'];

const Section = ({ title }) => (
  <section className="mt-12">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-[#012e4a]">{title}</h2>
      <button className="flex flex-col items-center justify-center px-[17px] py-[9px] w-[165px] h-[39px] min-h-[1px] bg-[#ffffff] border border-gray rounded-[20px] text-black text-sm hover:bg-[#012e4a] hover:text-white transition">
        Lihat Semua →
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {books.map((book, index) => (
        <Link key={index} to={`/book/${index + 1}`}>
        <div
          key={index}
          className="text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-lg cursor-pointer"
        >
          <div className="bg-white rounded shadow p-2">
            <img
              src={book.image}
              alt={book.title}
              className="mx-auto w-full aspect-[3/4] object-contain rounded"
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-[#012e4a]">{book.title}</p>
        </div>
        </Link>
      ))}
    </div>
  </section>
);

const CategoryFilter = () => (
  <div className="flex flex-wrap gap-3 justify-center py-6 bg-white">
    {categories.map((cat, i) => (
      <button
        key={i}
        className="flex items-center justify-center px-[17px] py-[9px] w-[165px] h-[39px] bg-[#012E4A] text-white text-sm border border-black rounded-[4.8px] shadow hover:opacity-90 transition-all"
      >
        {cat}
      </button>
    ))}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    setLoading(false); // selesai cek login
  }, []);

  return (
    <div className="font-sans bg-white">
      {/* Header */}
      <header className="relative flex flex-row items-center bg-white px-6 py-4 shadow">
        <div className="absolute w-[160px] h-[80px] top-0 left-1 bg-[#012E4A] rounded-tr-[100px] z-0" />
        <div className="flex items-center gap-4 z-10">
          <img src="/images/LandingPages/Logo3.png" alt="Logo Buku" className="h-12 ml-3" />
        </div>
        <div className="flex-1 flex justify-center z-10">
          <h1 className="text-2xl font-bold text-[#012e4a] text-center">
            Perpustakaan Digital UIN Suska Riau
          </h1>
        </div>
        <img src="/images/LandingPages/Logo2.png" alt="Logo UIN" className="h-10 z-10 mr-8" />
      </header>

      <div className="h-1 bg-[#35a4e9] w-full" />

      {/* Search & Action Bar */}
      <div className="flex items-center w-full px-6 py-6 bg-white">
        <div className="w-1/4" />
        <div className="flex items-center gap-4 flex-1 justify-center">
          <img src="/images/LandingPages/Logo1.png" alt="Baca Buku" className="w-15 h-15" />
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full shadow overflow-hidden w-full max-w-xl">
            <input
              type="text"
              placeholder="Cari Buku Disini"
              className="flex-1 px-3 py-2 outline-none bg-gray-100"
            />
            <button className="w-[44px] h-[42px] flex items-center justify-center bg-[#012E4A]">
              <img src="/images/Pencarian.png" alt="Cari" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 w-1/4 justify-end">
          {!loading &&
            (isLoggedIn ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex flex-row items-center justify-center px-1 py-5 gap-2 w-[90px] h-[40px] bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <img src="/images/Profil.png" alt="Akun" className="w-4 h-4" />
                Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  Daftar
                </button>
              </>
            ))}
        </div>
      </div>

      <div className="h-[6px] bg-[#f0f1f2] w-full filter drop-shadow-[0_4px_4px_rgba(1,46,74,0.5)]" />

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryFilter />
        <Section title="Buku Terbaru" />
        <Section title="Sains" />
        <Section title="Sastra" />

        {/* Banner bawah */}
        <div className="mt-12 py-12 relative overflow-hidden">
          <img src="/images/bawah.png" alt="Banner" className="w-full max-w-full mb-4" />
          <div className="absolute top-[76%] left-[9%] z-10">
            <button
              onClick={() => navigate('/register')}
              className="absolute w-[120px] min-w-[130px] h-[30px] px-[10px] py-[20px] 
                         bg-[#036280] rounded-full 
                         text-white text-[10px] font-semibold 
                         flex items-center justify-center transition"
            >
              Daftar Sekarang
              <span className="ml-1">➜</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#012e4a] text-white text-center py-4 mt-12">
        © {new Date().getFullYear()} Perpustakaan Digital UIN Suska Riau
      </footer>
    </div>
  );
};

export default Dashboard;
