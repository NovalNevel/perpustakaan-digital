import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BooksService from '../services/books';
import { SmoothCursor } from '@/components/magicui/smooth-cursor';

const DetailList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data ketika component mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Filter buku ketika data atau kategori berubah
  useEffect(() => {
    if (books.length > 0 && category) {
      filterBooksByCategory();
    }
  }, [books, category]);

  // Fungsi untuk memuat semua buku dari API
  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await BooksService.getAllBooks();
      const formattedBooks = data.map(book => BooksService.formatBookData(book));
      setBooks(formattedBooks);
    } catch (err) {
      setError('Gagal memuat data buku. Silakan coba lagi.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter buku berdasarkan kategori - UPDATED
  const filterBooksByCategory = () => {
    const decodedCategory = decodeURIComponent(category);
    let filtered = [];

    // Handle kategori khusus seperti di Dashboard
    switch (decodedCategory.toLowerCase()) {
      case 'buku-terbaru':
      case 'terbaru':
        // Gunakan logika yang sama seperti di Dashboard
        filtered = BooksService.getLatestBooks(books);
        break;
        
      case 'buku-tersedia':
      case 'tersedia':
        // Gunakan logika yang sama seperti di Dashboard
        filtered = BooksService.getAvailableBooks(books);
        break;
        
      default:
        // Untuk kategori regular, filter berdasarkan category field
        filtered = books.filter(book => {
          if (!book.category) return false;
          
          // Coba berbagai format matching
          const bookCategory = book.category.toLowerCase();
          const searchCategory = decodedCategory.toLowerCase();
          
          return bookCategory === searchCategory ||
                 bookCategory === searchCategory.replace('-', ' ') ||
                 bookCategory.replace(/\s+/g, '-') === searchCategory;
        });
        
        // Jika tidak ada hasil, coba dengan BooksService
        if (filtered.length === 0) {
          filtered = BooksService.filterBooksByCategory(books, decodedCategory);
        }
        break;
    }

    console.log(`Filtering for category: ${decodedCategory}`);
    console.log(`Found ${filtered.length} books`);
    setFilteredBooks(filtered);
  };

  // Fungsi untuk mendapatkan nama kategori yang sudah diformat - UPDATED
  const getCategoryDisplayName = (cat) => {
    const decodedCategory = decodeURIComponent(cat);
    const categoryMap = {
      'buku-terbaru': 'Buku Terbaru',
      'terbaru': 'Buku Terbaru',
      'buku-tersedia': 'Buku Tersedia', 
      'tersedia': 'Buku Tersedia',
      'populer': 'Buku Populer',
      'sains': 'Buku Sains',
      'seni-dan-desain': 'Buku Seni dan Desain',
      'seni dan desain': 'Buku Seni dan Desain',
      'sastra': 'Buku Sastra',
      'teknologi': 'Buku Teknologi',
      'sejarah': 'Buku Sejarah',
      'agama': 'Buku Agama',
      'ekonomi': 'Buku Ekonomi',
      'psikologi': 'Buku Psikologi',
      'pendidikan': 'Buku Pendidikan',
      'kesehatan': 'Buku Kesehatan',
      'hukum': 'Buku Hukum',
      'sosial': 'Buku Sosial'
    };
    
    const lowerCategory = decodedCategory.toLowerCase();
    return categoryMap[lowerCategory] || 
           categoryMap[lowerCategory.replace(/\s+/g, '-')] || 
           `Buku ${decodedCategory}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="font-sans bg-white min-h-screen">
        <SmoothCursor />
        {/* Header - sama seperti sebelumnya */}
        <header className="relative flex flex-row items-center bg-white px-6 py-4 shadow">
          <div className="absolute w-[160px] h-[80px] top-0 left-0 bg-[#012E4A] rounded-tr-[100px] z-0" />
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

        {/* Loading Content */}
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012e4a] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Memuat data buku...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="font-sans bg-white min-h-screen">
        {/* Header - sama seperti sebelumnya */}
        <header className="relative flex flex-row items-center bg-white px-6 py-4 shadow">
          <div className="absolute w-[160px] h-[80px] top-0 left-0 bg-[#012E4A] rounded-tr-[100px] z-0" />
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

        {/* Error Content */}
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <button
              onClick={loadBooks}
              className="px-6 py-3 bg-[#012e4a] text-white rounded-lg hover:bg-blue-700 transition mr-4"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white min-h-screen">
      <SmoothCursor />
      {/* Header - sama seperti Dashboard */}
      <header className="relative flex flex-row items-center bg-white px-6 py-4 shadow">
        <div className="absolute w-[160px] h-[80px] top-0 left-0 bg-[#012E4A] rounded-tr-[100px] z-0" />
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

      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#012e4a] hover:text-blue-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        
        <h2 className="text-xl font-bold text-[#012e4a]">
          {getCategoryDisplayName(category)}
        </h2>
        
        <div className="w-16" /> {/* Spacer untuk balance */}
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <p className="text-lg text-gray-600 mb-4">
              Tidak ada buku dalam kategori "{getCategoryDisplayName(category)}"
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Silakan pilih kategori lain atau kembali ke beranda untuk melihat semua buku.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#012e4a] text-white rounded-lg hover:bg-blue-700 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Menampilkan {filteredBooks.length} buku dalam kategori "{getCategoryDisplayName(category)}"
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Total tersedia: {filteredBooks.filter(book => book.available).length}</span>
              </div>
            </div>

            {/* Grid Buku */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer relative">
                    {/* Badge ketersediaan */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        book.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.available ? 'Tersedia' : 'Dipinjam'}
                      </span>
                    </div>

                    <div className="p-3">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full aspect-[3/4] object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/images/default-book.png';
                        }}
                      />
                    </div>
                    <div className="p-3 pt-0">
                      <h3 className="font-semibold text-sm text-[#012e4a] mb-1 line-clamp-2" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1" title={book.author}>
                        {book.author}
                      </p>
                      {book.publicationYear && (
                        <p className="text-xs text-gray-400 mb-1">
                          {book.publicationYear}
                        </p>
                      )}
                      {book.publisher && (
                        <p className="text-xs text-gray-400 truncate" title={book.publisher}>
                          {book.publisher}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#012e4a] text-white text-center py-4 mt-12">
        © {new Date().getFullYear()} Perpustakaan Digital UIN Suska Riau
      </footer>
    </div>
  );
};

export default DetailList;