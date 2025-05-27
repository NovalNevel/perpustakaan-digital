import React from 'react';

const books = [
  { title: "How Deal With Very Bad BOOK", image: "/images/LandingPages/Book/Book1.png" },
  { title: "The Hidden Mystery Behind", image: "/images/LandingPages/Book/Book2.png" },
  { title: "Detektif Conan", image: "/images/LandingPages/Book/Book3.png" },
  { title: "Flovely And Unicorn Erna", image: "/images/LandingPages/Book/Book4.png" },
  { title: "Simple Things You To Save BOOK", image: "/images/LandingPages/Book/Book5.png" }
];

const categories = ["Terbaru", "Populer", "Sains", "Seni dan Desain", "Sastra"];

const Section = ({ title }) => (
  <section className="mt-12 px-6 md:px-12">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-[#012e4a]">{title}</h2>
      <button className="text-sm text-[#012e4a] border border-[#012e4a] px-4 py-1 rounded-full hover:bg-[#012e4a] hover:text-white transition">
        Lihat Semua →
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {books.map((book, index) => (
        <div key={index} className="text-center hover:scale-105 transition transform duration-200">
          <img
            src={book.image}
            alt={book.title}
            className="mx-auto w-full h-48 object-cover rounded shadow"
          />
          <p className="mt-2 text-sm font-semibold text-[#012e4a]">{book.title}</p>
        </div>
      ))}
    </div>
  </section>
);

const CategoryFilter = () => (
  <div className="flex flex-wrap gap-2 justify-center py-4 bg-white">
    {categories.map((cat, i) => (
      <button
        key={i}
        className="px-4 py-1 bg-[#012e4a] text-white rounded-full text-sm hover:opacity-90 transition"
      >
        {cat}
      </button>
    ))}
  </div>
);

const Dashboard = () => {
  return (
    <div className="font-sans">
      {/* Header */}
      <header className="flex flex-row items-center bg-white px-6 py-4 shadow">
  <div className="flex items-center gap-4">
    <img src="/images/LandingPages/Logo3.png" alt="Logo Buku" className="h-12" />
  </div>
  <div className="flex-1 flex justify-center">
    <h1 className="text-2xl font-bold text-[#012e4a] text-center">
      Perpustakaan Digital UIN Suska Riau
    </h1>
  </div>
  <img src="/images/LandingPages/Logo2.png" alt="Logo UIN" className="h-10" />
</header>

      <div className="flex items-center w-full px-6 py-6 bg-white">
  {/* Spacer kiri */}
  <div className="w-1/4" />
  
  {/* Logo + Search Bar di tengah */}
  <div className="flex items-center gap-4 flex-1 justify-center">
    <img src="/images/LandingPages/Logo1.png" alt="Baca Buku" className="w-15 h-15" />
    <div className="flex items-center bg-gray-100 border rounded shadow overflow-hidden px-3 w-full max-w-xl">
      <input
        type="text"
        placeholder="Cari Buku Disini"
        className="flex-1 px-3 py-2 outline-none bg-gray-100"
      />
      <button className="px-3 py-2">
        <img src="/images/LandingPages/Search.png" alt="Cari" className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* Kanan: Akun & Daftar */}
  <div className="flex items-center gap-4 w-1/4 justify-end">
  <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition cursor-pointer">
    <img src="/images/LandingPages/user.png" alt="User" className="w-6 h-6" />
    <span className="text-sm text-[#012e4a]">Akun</span>
  </button>
  <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">
    Daftar
  </button>
</div>
</div>

      {/* Category Buttons */}
      <CategoryFilter />

      {/* Sections */}
      <Section title="Buku Terbaru" />
      <Section title="Sains" />
      <Section title="Sastra" />

      {/* Banner */}
      <div className="mt-12 bg-[#e6f0f6] px-8 py-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-sm italic text-orange-600 mb-2">Jadi Member Perpustakaan Sekarang</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#012e4a] leading-tight">
              Anda Bisa Menikmati Akses Ke Berbagai Koleksi Buku, Majalah, Dan Sumber Daya Digital Lainnya.
            </h2>
            <button className="mt-4 bg-[#012e4a] text-white px-6 py-2 rounded hover:bg-[#011f34] transition">
              Daftar →
            </button>
          </div>
          <img src="/images/LandingPages/girl.png" alt="Girl" className="mt-6 md:mt-0 w-60 md:w-72" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#012e4a] text-white text-center py-4 mt-12">
        © {new Date().getFullYear()} Perpustakaan Digital UIN Suska Riau
      </footer>
    </div>
  );
};

export default Dashboard;
