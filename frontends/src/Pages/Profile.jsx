import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../services/auth';

const Profile = () => {
  const navigate = useNavigate();
  const {logout} = auth();
  const [user, setUser] = useState({ username: '', email: '', nim: '' });

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      toast.error('Belum login');
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser({
      username: parsedUser.username,
      email: parsedUser.email,
      nim: parsedUser.nim,
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Logged out!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Logout error:', error);

      sessionStorage.clear();
      navigate('/dashboard');
    }
  };

  const borrowedBooks = [
    {
      title: 'Detektif Conan',
      author: 'Gōshō Aoyama',
      image: '/images/Book/Book3.png',
      borrowedDate: '20 Mei 2025',
      returnDate: '27 Mei 2025',
    },
    {
      title: 'Detektif Conan',
      author: 'Gōshō Aoyama',
      image: '/images/Book/Book3.png',
      borrowedDate: '22 Mei 2025',
      returnDate: '29 Mei 2025',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Tombol Kembali */}
        <div className="flex items-center mb-4"></div>

        {/* Satu Card Besar */}
        <div className="rounded-3xl shadow-2xl overflow-hidden">
          {/* Bagian Atas: Profil */}
          <div className="bg-[#002C4B] flex flex-col items-center text-center p-8 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 text-gray-200 hover:text-white"
              title="Kembali"
            >
              <img src="/images/img_arrowleft.svg" alt="Kembali" className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white mb-4">Profil Saya</h1>
            <img
              src="/images/Profil.png"
              alt="Profil"
              className="w-28 h-28 rounded-full object-cover shadow-md"
            />
            <h2 className="mt-4 text-lg font-bold text-white">{user.username}</h2>
            <p className="text-sm text-blue-100">{user.email}</p>
          </div>
          {/* Bagian Bawah: Status Peminjaman */}
          <div className="bg-white p-8">
            <h3 className="text-center font-semibold text-gray-800 bg-gray-200 py-2 rounded mb-4">
              Status Peminjaman Buku
            </h3>
            <div className="space-y-4">
              {borrowedBooks.map((book, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-xl shadow-sm p-4 flex items-center space-x-4"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-base font-bold">{book.title}</h3>
                    <p className="italic text-sm text-gray-700">{book.author}</p>
                    <p className="text-sm mt-1">📅 Peminjaman: {book.borrowedDate}</p>
                    <p className="text-sm">⏳ Tenggat: {book.returnDate}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="mt-8 w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition duration-300 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
