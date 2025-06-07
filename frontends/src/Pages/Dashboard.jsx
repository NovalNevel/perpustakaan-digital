import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BooksService from '../services/books';
import { SmoothCursor } from '@/components/magicui/smooth-cursor';

const Section = ({ title, books, loading, error }) => {
  const navigate = useNavigate();

  const getCategorySlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
  };

  const handleLihatSemua = () => {
    const categorySlug = getCategorySlug(title);
    navigate(`/category/${categorySlug}`);
  };

  if (loading) {
    return (
      <section className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#012e4a]">{title}</h2>
          <button
            disabled
            className="flex flex-col items-center justify-center px-[17px] py-[9px] w-[165px] h-[39px] min-h-[1px] bg-gray-300 border border-gray-300 rounded-[20px] text-gray-500 text-sm cursor-not-allowed"
          >
            Loading...
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-200 rounded shadow p-2 animate-pulse">
                <div className="mx-auto w-full aspect-[3/4] bg-gray-300 rounded"></div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-2/3 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#012e4a]">{title}</h2>
          <button
            onClick={handleLihatSemua}
            className="flex flex-col items-center justify-center px-[17px] py-[9px] w-[165px] h-[39px] min-h-[1px] bg-white border border-gray-300 rounded-[20px] text-black text-sm hover:bg-[#012e4a] hover:text-white transition-colors duration-300"
          >
            Lihat Semua →
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Gagal memuat data buku.</span>
            <br />
            Silakan periksa koneksi internet Anda dan coba lagi nanti.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <SmoothCursor />
        <h2 className="text-xl font-bold text-[#012e4a]">{title}</h2>
        {books.length > 0 && (
          <button
            onClick={handleLihatSemua}
            className="flex flex-col items-center justify-center px-[17px] py-[9px] w-[165px] h-[39px] min-h-[1px] bg-white border border-gray-300 rounded-[20px] text-black text-sm hover:bg-[#012e4a] hover:text-white transition-colors duration-300 shadow-sm"
          >
            Lihat Semua →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <SmoothCursor />
        {books.length > 0 ? (
          books.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`}>
              <div className="group transform transition-transform duration-300 hover:scale-105 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 cursor-pointer">
                <div className="overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full aspect-[3/4] object-cover transition-all duration-300 ease-in-out"
                    onError={(e) => {
                      e.target.src = '/images/default-book.png';
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-semibold text-[#012e4a] line-clamp-2 min-h-[2.5rem]">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-1 min-h-[1rem]">{book.author}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {book.available ? 'Tersedia' : 'Dipinjam'}
                    </span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[70px]">
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-14 text-gray-500">
            <SmoothCursor />
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-600">Tidak ada buku tersedia</p>
              <p className="text-sm text-gray-500 mt-1">
                untuk kategori <span className="font-semibold text-gray-700">"{title}"</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const CategoryFilter = ({ categories, loading, onCategoryClick }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    if (onCategoryClick) {
      onCategoryClick(category);
    }
    navigate(`/category/${categorySlug}`);
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3 justify-center py-8 bg-white">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-[140px] h-[36px] bg-gray-300 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-8 bg-white">
      <SmoothCursor />
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.slice(0, 8).map((cat, i) => (
          <button
            key={i}
            onClick={() => handleCategoryClick(cat)}
            className="flex items-center justify-center px-4 py-2 min-w-[140px] h-[36px] bg-[#012E4A] text-white text-sm border border-[#012E4A] rounded-md shadow-sm hover:bg-[#014a6b] hover:shadow-md transition-all duration-300 font-medium"
          >
            {cat}
          </button>
        ))}
        {categories.length > 8 && (
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center justify-center px-4 py-2 min-w-[140px] h-[36px] bg-white text-[#012E4A] text-sm border border-[#012E4A] rounded-md shadow-sm hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            Lihat Semua
          </button>
        )}
      </div>
    </div>
  );
};

const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 font-medium">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // State untuk hasil pencarian
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // State untuk data buku dan kategori
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data saat komponen dimuat
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
    setLoading(false);

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setBooksLoading(true);
      setCategoriesLoading(true);
      setError(null);

      // Load semua buku dari API
      const booksResponse = await BooksService.getAllBooks();

      if (booksResponse && Array.isArray(booksResponse)) {
        // Format data buku
        const formattedBooks = booksResponse.map((book) => BooksService.formatBookData(book));
        setAllBooks(formattedBooks);

        // Ekstrak kategori dari data buku yang ada
        const extractedCategories = BooksService.extractCategoriesFromBooks(booksResponse);
        setCategories(extractedCategories);

        // Debug logging
        console.log('Total books loaded:', formattedBooks.length);
        console.log('Categories found:', extractedCategories);
        console.log('Sample book data:', formattedBooks[0]);
      } else {
        throw new Error('Data buku tidak valid');
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Gagal memuat data buku');
    } finally {
      setBooksLoading(false);
      setCategoriesLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Masukkan kata kunci pencarian');
      return;
    }

    setSearchError(null);
    setSearchLoading(true);

    try {
      const results = await BooksService.searchBooks(searchQuery);
      console.log('Search results:', results);
      const formattedResults = results.map((book) => BooksService.formatBookData(book));
      setSearchResults(formattedResults);
      if (formattedResults.length === 0) {
        setSearchError('Tidak ada buku yang cocok dengan pencarian Anda.');
      }
    } catch (err) {
      setSearchError('Gagal melakukan pencarian. Silakan coba lagi.');
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Tangkap enter key untuk pencarian
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Reset hasil pencarian kalau input kosong
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearchError(null);
    }
  }, [searchQuery]);

  // FIXED: Get books by category dengan debugging
  const getBooksByCategory = (sectionTitle) => {
    if (!allBooks.length) {
      console.log(`No books available for section: ${sectionTitle}`);
      return [];
    }

    try {
      let result = [];

      switch (sectionTitle) {
        case 'Buku Terbaru':
          result = BooksService.getLatestBooks(allBooks, 5);
          break;
        case 'Buku Tersedia':
          result = BooksService.getAvailableBooks(allBooks, 5);
          break;
        default:
          // Untuk kategori regular, pastikan menggunakan nama kategori yang tepat
          result = allBooks
            .filter((book) => {
              // Debug logging
              const bookCategory = book.category;
              const matches =
                bookCategory && bookCategory.toLowerCase() === sectionTitle.toLowerCase();

              if (bookCategory) {
                console.log(
                  `Book: ${book.title}, Category: ${bookCategory}, Matches ${sectionTitle}:`,
                  matches
                );
              }

              return matches;
            })
            .slice(0, 5);

          // Alternative jika filter di atas tidak berhasil, coba dengan BooksService
          if (result.length === 0) {
            result = BooksService.filterBooksByCategory(allBooks, sectionTitle, 5);
          }
          break;
      }

      console.log(`Books found for "${sectionTitle}":`, result.length);
      if (result.length > 0) {
        console.log('Sample book from this category:', result[0]);
      }

      return result;
    } catch (error) {
      console.error(`Error getting books for category "${sectionTitle}":`, error);
      return [];
    }
  };

  const handleCategoryFilter = (category) => {
    // Optional: implement filtering logic here if needed
    console.log('Category selected:', category);
  };

  const handleRetry = () => {
    loadInitialData();
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <SmoothCursor />
      {/* Header */}
      <header className="relative flex flex-row items-center bg-white px-6 py-4 shadow-sm">
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

      {/* Search & Action Bar */}
      <div className="flex items-center w-full px-6 py-6 bg-white border-b border-gray-100">
        {/* Spacer */}
        <div className="w-1/4" />

        {/* Search Bar */}
        <div className="flex items-center gap-4 flex-1 justify-center relative">
          <img src="/images/LandingPages/Logo1.png" alt="Baca Buku" className="w-15 h-15" />

          <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-full shadow-sm overflow-hidden w-full max-w-xl hover:shadow-md transition-shadow duration-300">
            <input
              type="text"
              placeholder="Cari judul buku, penulis, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 outline-none bg-transparent text-gray-700 placeholder-gray-500"
            />
            <button
              onClick={handleSearch}
              className="w-[48px] h-[48px] flex items-center justify-center bg-[#012E4A] hover:bg-[#014a6b] transition-colors duration-300"
              disabled={!searchQuery.trim() || searchLoading}
            >
              <img src="/images/Pencarian.png" alt="Cari" className="w-5 h-5" />
            </button>
          </div>

          {/* Loading */}
          {searchLoading && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto p-2 space-y-2">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-2 animate-pulse">
                  <div className="w-14 h-20 bg-gray-200 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {searchError && (
            <div className="absolute top-full mt-2 left-0 w-full flex justify-center z-50">
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">{searchError}</div>
            </div>
          )}

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto p-2">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  {/* Gambar dari lokal */}
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-md shadow-sm"
                    onError={(e) => (e.target.src = '/images/default-book.png')}
                  />

                  {/* Info Buku */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {highlightText(book.title, searchQuery)}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      Penulis: {highlightText(book.author, searchQuery)}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                          book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {book.available ? 'Tersedia' : 'Dipinjam'}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[80px]">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login/Profile Section */}
        <div className="flex items-center gap-3 w-1/4 justify-end">
          {!loading &&
            (isLoggedIn ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex flex-row items-center justify-center px-3 py-2 gap-2 min-w-[90px] h-[40px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-sm"
              >
                <img src="/images/Profil.png" alt="Akun" className="w-4 h-4" />
                Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-300 shadow-sm font-medium"
                >
                  Daftar
                </button>
              </>
            ))}
        </div>
      </div>

      {/* Bottom shadow bar */}
      <div className="h-[6px] bg-[#f0f1f2] w-full filter drop-shadow-[0_4px_4px_rgba(1,46,74,0.5)]" />

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Error state dengan retry option */}
        {error && !booksLoading && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          loading={categoriesLoading}
          onCategoryClick={handleCategoryFilter}
        />

        {/* Section Buku Terbaru */}
        <Section
          title="Buku Terbaru"
          books={getBooksByCategory('Buku Terbaru')}
          loading={booksLoading}
          error={error}
        />

        {/* Section Buku Tersedia */}
        <Section
          title="Buku Tersedia"
          books={getBooksByCategory('Buku Tersedia')}
          loading={booksLoading}
          error={error}
        />

        {/* Dynamic sections berdasarkan kategori yang ada */}
        {categories.slice(0, 3).map((category) => (
          <Section
            key={category}
            title={category}
            books={getBooksByCategory(category)}
            loading={booksLoading}
            error={error}
          />
        ))}

        {/* Debug Information - Remove in production */}
        {/* {!booksLoading && !error && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
            <p className="text-sm text-yellow-700">Total Books: {allBooks.length}</p>
            <p className="text-sm text-yellow-700">Categories: {categories.join(', ')}</p>
            {allBooks.length > 0 && (
              <p className="text-sm text-yellow-700">
                Sample book category: {allBooks[0].category}
              </p>
            )}
          </div>
        )} */}

        {/* Statistics Section */}
        {!booksLoading && !error && allBooks.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#012e4a] mb-4">Statistik Perpustakaan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{allBooks.length}</div>
                <div className="text-sm text-gray-600">Total Buku</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {allBooks.filter((book) => book.available).length}
                </div>
                <div className="text-sm text-gray-600">Buku Tersedia</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {allBooks.filter((book) => !book.available).length}
                </div>
                <div className="text-sm text-gray-600">Sedang Dipinjam</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                <div className="text-sm text-gray-600">Kategori</div>
              </div>
            </div>
          </div>
        )}

        {/* Banner bawah */}
        <div className="mt-12 py-12 relative overflow-hidden">
          <img src="/images/bawah.png" alt="Banner" className="w-full max-w-full mb-4 rounded-lg" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#012e4a] text-white text-center py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">© {new Date().getFullYear()} Perpustakaan Digital UIN Suska Riau</p>
          <p className="text-sm text-blue-200">Mengelola Pengetahuan untuk Kemajuan Pendidikan</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
