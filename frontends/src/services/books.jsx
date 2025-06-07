import fetchWithAuth from "./fetchWithAuth";

// services/books.js
const API_BASE_URL = 'https://perpustakaan-digital-production-9625.up.railway.app/api';

class BooksService {
  // Helper method untuk mendapatkan authorization header
  static getAuthHeaders() {
    const token = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Helper method untuk handle API response dengan error handling yang lebih baik
  static async handleApiResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  // Mengambil semua buku - menggunakan endpoint /api/books
  static async getAllBooks() {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/books`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // Mengambil buku berdasarkan ID - menggunakan endpoint /api/books/:id
  static async getBookById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      throw error;
    }
  }

  // Mengambil data peminjaman buku user - FIXED dengan auth header dan error handling
  static async getMyLoans() {
    try {
      // Pastikan user sudah login
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await fetchWithAuth(`${API_BASE_URL}/books/my-loans`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching my loans:', error);

      // Handle specific error cases
      if (error.message.includes('401')) {
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.message.includes('403')) {
        throw new Error('Anda tidak memiliki akses untuk melihat data peminjaman.');
      } else if (error.message.includes('404')) {
        throw new Error('Endpoint tidak ditemukan. Periksa konfigurasi API.');
      } else if (
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      ) {
        throw new Error('Koneksi bermasalah. Periksa koneksi internet Anda.');
      }

      throw error;
    }
  }

  // Test koneksi ke API
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Koneksi berhasil' : `HTTP ${response.status}`,
      };
    } catch (error) {
      return {
        success: false,
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  // Mencari buku - menggunakan client-side filtering karena API tidak mendukung search parameter
  static async searchBooks(query) {
    try {
      const allBooks = await this.getAllBooks();
      if (!query) return [];
      const searchTerms = query.toLowerCase();
      const filteredBooks = allBooks.filter(
        (book) =>
          (book.title && book.title.toLowerCase().includes(searchTerms)) ||
          (book.author && book.author.toLowerCase().includes(searchTerms)) ||
          (book.category &&
            book.category.name &&
            book.category.name.toLowerCase().includes(searchTerms)) ||
          (book.publisher && book.publisher.toLowerCase().includes(searchTerms))
      );
      // Pastikan return array!
      return filteredBooks;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }
  // Fungsi untuk meminjam buku (jika API mendukung)
  static async borrowBook(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/borrow`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
      return await this.handleApiResponse(response);
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  }

  // Fungsi untuk mengembalikan buku (jika API mendukung)
  static async returnBook(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/return`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
      return await this.handleApiResponse(response);
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  }

  // Rest of the methods remain the same...
  // (I'll keep the utility methods as they were since they're working fine)

  // Ekstrak semua kategori unik dari data buku
  static extractCategoriesFromBooks(books) {
    try {
      const categories = [...new Set(books.map((book) => book.category?.name).filter(Boolean))];
      return categories.sort(); // Sort alphabetically
    } catch (error) {
      console.error('Error extracting categories:', error);
      return [];
    }
  }

  // Filter buku berdasarkan kategori dari data yang sudah ada
  static filterBooksByCategory(books, categoryName, limit = null) {
    try {
      const filtered = books.filter((book) => {
        if (!book.category?.name) return false;
        return book.category.name.toLowerCase() === categoryName.toLowerCase();
      });

      return limit ? filtered.slice(0, limit) : filtered;
    } catch (error) {
      console.error('Error filtering books by category:', error);
      return [];
    }
  }

  // Get latest books (berdasarkan createdAt)
  static getLatestBooks(books, limit = 5) {
    try {
      return books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    } catch (error) {
      console.error('Error getting latest books:', error);
      return [];
    }
  }

  // Get books by availability
  static getAvailableBooks(books, limit = null) {
    try {
      const filtered = books.filter((book) => book.available === true);
      return limit ? filtered.slice(0, limit) : filtered;
    } catch (error) {
      console.error('Error getting available books:', error);
      return [];
    }
  }

  // Get books by specific criteria
  static getBooksBy(books, criteria, limit = null) {
    try {
      let filtered = books;

      // Filter berdasarkan kriteria yang diberikan
      if (criteria.available !== undefined) {
        filtered = filtered.filter((book) => book.available === criteria.available);
      }

      if (criteria.category) {
        filtered = filtered.filter(
          (book) => book.category?.name?.toLowerCase() === criteria.category.toLowerCase()
        );
      }

      if (criteria.language) {
        filtered = filtered.filter(
          (book) => book.language?.toLowerCase() === criteria.language.toLowerCase()
        );
      }

      if (criteria.publicationYear) {
        filtered = filtered.filter((book) => book.publicationYear === criteria.publicationYear);
      }

      // Sorting
      if (criteria.sortBy) {
        switch (criteria.sortBy) {
          case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'author':
            filtered.sort((a, b) => a.author.localeCompare(b.author));
            break;
          case 'year':
            filtered.sort((a, b) => b.publicationYear - a.publicationYear);
            break;
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          default:
            break;
        }
      }

      return limit ? filtered.slice(0, limit) : filtered;
    } catch (error) {
      console.error('Error getting books by criteria:', error);
      return [];
    }
  }

  // Format data buku untuk konsistensi UI
 static formatBookData(book) {
  try {
    return {
      id: book.id,
      title: (book.title || 'Judul tidak tersedia').trim(),
      author: (book.author || 'Penulis tidak diketahui').trim(),
      publisher: (book.publisher || '').trim(),
      publicationYear: book.publicationYear || '',
      isbn: book.isbn || '',
      pages: book.pages || 0,
      language: (book.language || 'Indonesia').trim(),
      shelf: (book.shelf || '').trim(),
      location: (book.location || '').trim(),
      available: book.available !== undefined ? book.available : false,
      image: book.image || book.imageUrl || '/images/default-book.png', // <-- perbaiki di sini
      category: book.category?.name || 'Umum',
      categoryId: book.categoryId || book.category?.id || null,
      createdAt: book.createdAt || new Date().toISOString(),
    };
  } catch (error) {
      console.error('Error formatting book data:', error);
      return {
        id: book.id || 'unknown',
        title: 'Judul tidak tersedia',
        author: 'Penulis tidak diketahui',
        publisher: '',
        publicationYear: '',
        isbn: '',
        pages: 0,
        language: 'Indonesia',
        shelf: '',
        location: '',
        image: '/images/default-book.png',
        category: 'Umum',
        categoryId: null,
        available: false,
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Format data loan untuk konsistensi UI (FIXED FIELD NAMES)
  static formatLoanData(loan) {
    try {
      return {
        id: loan.id,
        bookId: loan.bookId,
        book: loan.book ? this.formatBookData(loan.book) : null,
        borrowDate: loan.borrowedDate || loan.createdAt, // FIXED: borrowedDate instead of borrowDate
        dueDate: loan.dueDate,
        returnDate: loan.returnedDate || null, // FIXED: returnedDate instead of returnDate
        status: loan.status ? loan.status.toLowerCase() : 'borrowed', // FIXED: convert to lowercase
        fine: loan.fine || 0,
        userId: loan.userId,
        createdAt: loan.createdAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error formatting loan data:', error);
      return {
        id: loan.id || 'unknown',
        bookId: loan.bookId || null,
        book: null,
        borrowDate: new Date().toISOString(),
        dueDate: null,
        returnDate: null,
        status: 'unknown',
        fine: 0,
        userId: null,
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Get book statistics
  static getBookStatistics(books) {
    try {
      const totalBooks = books.length;
      const availableBooks = books.filter((book) => book.available).length;
      const categoriesCount = this.extractCategoriesFromBooks(books).length;
      const languages = [...new Set(books.map((book) => book.language).filter(Boolean))];

      // Statistik per kategori
      const categoryStats = {};
      books.forEach((book) => {
        const categoryName = book.category?.name || 'Lainnya';
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = { total: 0, available: 0 };
        }
        categoryStats[categoryName].total++;
        if (book.available) {
          categoryStats[categoryName].available++;
        }
      });

      return {
        total: totalBooks,
        available: availableBooks,
        borrowed: totalBooks - availableBooks,
        categories: categoriesCount,
        languages: languages.length,
        categoryBreakdown: categoryStats,
      };
    } catch (error) {
      console.error('Error getting book statistics:', error);
      return {
        total: 0,
        available: 0,
        borrowed: 0,
        categories: 0,
        languages: 0,
        categoryBreakdown: {},
      };
    }
  }

  // Get loan statistics (FIXED STATUS HANDLING)
  static getLoanStatistics(loans) {
    try {
      const totalLoans = loans.length;
      const activeLoans = loans.filter(
        (loan) => loan.status && loan.status.toLowerCase() === 'borrowed'
      ).length;
      const returnedLoans = loans.filter(
        (loan) => loan.status && loan.status.toLowerCase() === 'returned'
      ).length;
      const overdueLoans = loans.filter((loan) => {
        if (!loan.status || loan.status.toLowerCase() !== 'borrowed' || !loan.dueDate) return false;
        return new Date(loan.dueDate) < new Date();
      }).length;

      const totalFines = loans.reduce((sum, loan) => sum + (loan.fine || 0), 0);

      return {
        total: totalLoans,
        active: activeLoans,
        returned: returnedLoans,
        overdue: overdueLoans,
        totalFines: totalFines,
      };
    } catch (error) {
      console.error('Error getting loan statistics:', error);
      return {
        total: 0,
        active: 0,
        returned: 0,
        overdue: 0,
        totalFines: 0,
      };
    }
  }

  // Utility function untuk validasi data buku
  static validateBookData(book) {
    const errors = [];

    if (!book.title || book.title.trim() === '') {
      errors.push('Judul buku harus diisi');
    }

    if (!book.author || book.author.trim() === '') {
      errors.push('Penulis buku harus diisi');
    }

    if (!book.category || !book.category.name) {
      errors.push('Kategori buku harus diisi');
    }

    if (book.isbn && book.isbn.length < 10) {
      errors.push('ISBN tidak valid');
    }

    if (book.pages && (isNaN(book.pages) || book.pages <= 0)) {
      errors.push('Jumlah halaman harus berupa angka positif');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Utility function untuk mengecek apakah buku sudah lewat batas waktu (FIXED STATUS HANDLING)
  static isBookOverdue(loan) {
    if (!loan.dueDate || !loan.status || loan.status.toLowerCase() !== 'borrowed') return false;
    return new Date(loan.dueDate) < new Date();
  }

  // Utility function untuk menghitung hari keterlambatan
  static calculateOverdueDays(loan) {
    if (!this.isBookOverdue(loan)) return 0;
    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    const diffTime = today - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Utility function untuk membersihkan data yang mengandung tab/whitespace
  static cleanBookData(books) {
    return books.map((book) => this.formatBookData(book));
  }

  // Utility function untuk mengecek ketersediaan buku
  static checkBookAvailability(book) {
    return {
      available: book.available === true,
      status: book.available ? 'Tersedia' : 'Sedang Dipinjam',
      location: book.location?.trim() || 'Lokasi tidak diketahui',
      shelf: book.shelf?.trim() || 'Rak tidak diketahui',
    };
  }

  // Utility function untuk mendapatkan informasi lengkap buku
  static getBookInfo(book) {
    const formattedBook = this.formatBookData(book);
    const availability = this.checkBookAvailability(book);

    return {
      ...formattedBook,
      ...availability,
      fullTitle: `${formattedBook.title} (${formattedBook.publicationYear})`,
      fullAuthor: formattedBook.author,
      bookCode: formattedBook.isbn || formattedBook.id,
      categoryInfo: {
        id: formattedBook.categoryId,
        name: formattedBook.category,
      },
    };
  }

  // Get books dengan paginasi (untuk optimasi performa)
  static getPaginatedBooks(books, page = 1, limit = 10) {
    try {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = books.slice(startIndex, endIndex);

      return {
        data: paginatedBooks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(books.length / limit),
          totalItems: books.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < books.length,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error('Error paginating books:', error);
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  }

  // ADDED: Utility function untuk format tanggal Indonesia
  static formatDateIndonesia(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  }

  // ADDED: Get active loans (borrowed books)
  static getActiveLoans(loans) {
    try {
      return loans.filter((loan) => loan.status && loan.status.toLowerCase() === 'borrowed');
    } catch (error) {
      console.error('Error getting active loans:', error);
      return [];
    }
  }

  // ADDED: Get overdue loans
  static getOverdueLoans(loans) {
    try {
      return loans.filter((loan) => this.isBookOverdue(loan));
    } catch (error) {
      console.error('Error getting overdue loans:', error);
      return [];
    }
  }
}

export default BooksService;
