import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BooksService from '../../services/books.jsx';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookData = await BooksService.getBookById(id);
        const formattedBook = BooksService.formatBookData(bookData);
        setBook(formattedBook);
      } catch (error) {
        console.error('Error fetching book detail:', error);
        setError('Gagal memuat detail buku. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f2f7ff] to-[#d6e4f0] py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-[#012e4a] text-white">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm hover:text-gray-200"
            >
              <img src="/images/img_arrowleft.svg" alt="back" className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-center flex-1">Detail Buku</h1>
            <div className="w-12" />
          </div>
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012e4a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail buku...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f2f7ff] to-[#d6e4f0] py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-[#012e4a] text-white">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm hover:text-gray-200"
            >
              <img src="/images/img_arrowleft.svg" alt="back" className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-center flex-1">Detail Buku</h1>
            <div className="w-12" />
          </div>
          <div className="p-6 text-center">
            <p className="text-lg text-red-600">{error || 'Buku tidak ditemukan'}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f7ff] to-[#d6e4f0] py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#012e4a] text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm hover:text-gray-200"
          >
            <img src="/images/img_arrowleft.svg" alt="back" className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">Detail Buku</h1>
          <div className="w-12" />
        </div>

        {/* Isi Card */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Gambar */}
          <div className="flex justify-center items-start">
            <img
              src={book.image}
              alt={book.title}
              className="w-52 h-auto object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = '/images/default-book.png';
              }}
            />
          </div>

          {/* Detail Buku */}
          <div className="space-y-3 text-sm text-gray-800">
            <h2 className="text-2xl font-bold text-[#012e4a]">{book.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <strong>Kategori:</strong> {book.category}
              </div>
              <div>
                <strong>ISBN:</strong> {book.isbn || '-'}
              </div>
              <div>
                <strong>Penulis:</strong> {book.author}
              </div>
              <div>
                <strong>Penerbit:</strong> {book.publisher || '-'}
              </div>
              <div>
                <strong>Bahasa:</strong> {book.language}
              </div>
              <div>
                <strong>Tahun Terbit:</strong> {book.publicationYear || '-'}
              </div>
              <div>
                <strong>Jumlah Halaman:</strong> {book.pages || '-'}
              </div>
              <div>
                <strong>Rak:</strong> {book.shelf || '-'}
              </div>
              <div className="sm:col-span-2">
                <strong>Lokasi:</strong> {book.location || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Ketersediaan */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-[#012e4a] mb-3">Status Ketersediaan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg text-center shadow ${
              book.available 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className="text-xs text-gray-600">Status</p>
              <p className={`text-2xl font-bold ${
                book.available ? 'text-green-600' : 'text-red-600'
              }`}>
                {book.available ? 'Tersedia' : 'Dipinjam'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;