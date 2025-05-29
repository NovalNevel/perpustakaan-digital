import { useParams, useNavigate } from 'react-router-dom';

const books = [
  {
    id: 1,
    title: 'How Deal With Very Bad BOOK',
    author: 'Anonim',
    publisher: 'UIN Press',
    language: 'Indonesia',
    description: 'Buku ini membahas cara menghadapi buku yang buruk dengan cara yang baik.',
    location: 'Perpustakaan Utama',
    jumlah: 5,
    terpinjam: 2,
    tersedia: 3,
    image: '/images/Book/Book1.png',
  },
  {
    id: 2,
    title: 'The Hidden Mystery Behind',
    author: 'John Doe',
    publisher: 'Mystery Inc.',
    language: 'English',
    description: 'Rahasia tersembunyi di balik kehidupan sehari-hari.',
    location: 'Perpustakaan 2',
    jumlah: 3,
    terpinjam: 1,
    tersedia: 2,
    image: '/images/Book/Book2.png',
  },
  {
    id: 3,
    title: 'Detektif Conan',
    author: 'Gosho Aoyama',
    publisher: 'Shogakukan',
    language: 'Indonesia',
    description: 'Petualangan detektif cilik yang memecahkan berbagai kasus misterius.',
    location: 'Perpustakaan Manga',
    jumlah: 10,
    terpinjam: 6,
    tersedia: 4,
    image: '/images/Book/Book3.png',
  },
  {
    id: 4,
    title: 'Flovely And Unicorn Erna',
    author: 'Sieber & Stöhr',
    publisher: 'Tales for Kids',
    language: 'English',
    description: 'Kisah petualangan Flovely bersama unicorn Erna di negeri ajaib.',
    location: 'Perpustakaan Anak',
    jumlah: 7,
    terpinjam: 3,
    tersedia: 4,
    image: '/images/Book/Book4.png',
  },
  {
    id: 5,
    title: 'Simple Things You To Save BOOK',
    author: 'Budi Santosa',
    publisher: 'EcoReads',
    language: 'Indonesia',
    description: 'Langkah-langkah sederhana untuk menjaga dan merawat buku.',
    location: 'Perpustakaan Utama',
    jumlah: 4,
    terpinjam: 1,
    tersedia: 3,
    image: '/images/Book/Book5.png',
  },
];

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-600">Buku tidak ditemukan</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Kembali
        </button>
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
            />
          </div>

          {/* Detail Buku */}
          <div className="space-y-3 text-sm text-gray-800">
            <h2 className="text-2xl font-bold text-[#012e4a]">{book.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <strong>Judul Seri:</strong> -
              </div>
              <div>
                <strong>Kode Buku:</strong> -
              </div>
              <div>
                <strong>Penulis:</strong> {book.author}
              </div>
              <div>
                <strong>Penerbit:</strong> {book.publisher}
              </div>
              <div>
                <strong>Bahasa:</strong> {book.language}
              </div>
              <div>
                <strong>ISBN/ISSN:</strong> -
              </div>
              <div className="sm:col-span-2">
                <strong>Deskripsi:</strong> {book.description}
              </div>
              <div className="sm:col-span-2">
                <strong>Lokasi:</strong> {book.location}
              </div>
            </div>
          </div>
        </div>

        {/* Ketersediaan */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-[#012e4a] mb-3">Ketersediaan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f0f4f8] p-4 rounded-lg text-center shadow">
              <p className="text-xs text-gray-600">Jumlah Buku</p>
              <p className="text-2xl font-bold text-[#012e4a]">{book.jumlah}</p>
            </div>
            <div className="bg-[#f0f4f8] p-4 rounded-lg text-center shadow">
              <p className="text-xs text-gray-600">Terpinjam</p>
              <p className="text-2xl font-bold text-[#c1121f]">{book.terpinjam}</p>
            </div>
            <div className="bg-[#f0f4f8] p-4 rounded-lg text-center shadow">
              <p className="text-xs text-gray-600">Tersedia</p>
              <p className="text-2xl font-bold text-[#2a9d8f]">{book.tersedia}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
