import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../../services/auth.jsx';
import BooksService from '../../services/books.jsx';
import { SmoothCursor } from '../../components/magicui/smooth-cursor.js';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = auth();
  const [user, setUser] = useState({ username: '', email: '', nim: '' });
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

    fetchMyLoans();
  }, [navigate]);

  const fetchMyLoans = async () => {
    try {
      setLoading(true);
      const rawLoans = await BooksService.getMyLoans();
      const formattedLoans = rawLoans.map(loan => BooksService.formatLoanData(loan));
      setLoans(formattedLoans);
      setError(null);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError('Gagal memuat data peminjaman');
      toast.error('Gagal memuat data peminjaman');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusBadge = (loan) => {
    const isOverdue = BooksService.isBookOverdue(loan);
    const status = loan.status;

    if (isOverdue) {
      const overdueDays = BooksService.calculateOverdueDays(loan);
      return (
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          Terlambat {overdueDays} hari
        </span>
      );
    }

    switch (status) {
      case 'borrowed':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Sedang Dipinjam</span>;
      case 'returned':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Sudah Dikembalikan</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak diketahui';
    return BooksService.formatDateIndonesia(dateString);
  };

  const loanStats = BooksService.getLoanStatistics(loans);
  const activeLoans = BooksService.getActiveLoans(loans);
  const overdueLoans = BooksService.getOverdueLoans(loans);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center px-4 py-10">
      <SmoothCursor />
      <div className="w-full max-w-4xl">
        <div className="rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#002C4B] flex flex-col items-center text-center p-8 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 text-gray-200 hover:text-white transition-colors"
              title="Kembali"
            >
              <img src="/images/img_arrowleft.svg" alt="Kembali" className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white mb-4">Profil Saya</h1>
            {loading ? (
              <div className="w-28 h-28 rounded-full bg-blue-300 animate-pulse" />
            ) : (
              <img
                src="/images/Profil.png"
                alt="Profil"
                className="w-28 h-28 rounded-full object-cover shadow-md"
              />
            )}
            <h2 className="mt-4 text-lg font-bold text-white">{user.username}</h2>
            <p className="text-sm text-blue-100">{user.email}</p>
            {user.nim && <p className="text-sm text-blue-100">NIM: {user.nim}</p>}
          </div>

          <div className="bg-white p-8">
            <h3 className="text-center font-semibold text-gray-800 bg-gray-200 py-2 rounded mb-4">
              Status Peminjaman Buku
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchMyLoans}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-8">
                <img 
                  src="/images/empty-books.png" 
                  alt="Tidak ada peminjaman" 
                  className="w-24 h-24 mx-auto mb-4 opacity-50"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p className="text-gray-600">Belum ada buku yang dipinjam</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Jelajahi Buku
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.map((loan, index) => (
                  <div
                    key={loan.id || index}
                    className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={loan.book?.image || '/images/default-book.png'}
                        alt={loan.book?.title || 'Buku'}
                        className="w-20 h-28 object-cover rounded shadow-sm"
                        onError={(e) => {
                          e.target.src = '/images/default-book.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-bold text-gray-800 leading-tight">
                            {loan.book?.title || 'Judul tidak tersedia'}
                          </h3>
                          {getStatusBadge(loan)}
                        </div>
                        <p className="italic text-sm text-gray-600 mb-2">
                          {loan.book?.author || 'Penulis tidak diketahui'}
                        </p>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="flex items-center">
                            <span className="mr-2">📅</span>
                            Dipinjam: {formatDate(loan.borrowDate)}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">⏳</span>
                            Tenggat: {formatDate(loan.dueDate)}
                          </p>
                          {loan.returnDate && (
                            <p className="flex items-center text-green-600">
                              <span className="mr-2">✅</span>
                              Dikembalikan: {formatDate(loan.returnDate)}
                            </p>
                          )}
                          {BooksService.isBookOverdue(loan) && (
                            <p className="flex items-center text-red-600 font-medium">
                              <span className="mr-2">⚠️</span>
                              Terlambat {BooksService.calculateOverdueDays(loan)} hari
                            </p>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>ISBN: {loan.book?.isbn || 'Tidak tersedia'}</p>
                          <p>Kategori: {loan.book?.category || 'Tidak diketahui'}</p>
                          <p>Lokasi: {loan.book?.location?.trim() || 'Tidak diketahui'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <div className="text-center mt-6">
                <button
                  onClick={fetchMyLoans}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  🔄 Refresh Data
                </button>
              </div>
            )}

            <button
              onClick={() => setShowLogoutModal(true)}
              className="mt-8 w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition duration-300 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin keluar?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
