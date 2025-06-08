import React from "react";

const BookCard = ({ book, loan, onEdit, onDelete, onBorrow, onReturn }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-3 aspect-h-4 overflow-hidden">
                <img
                    src={book.imageUrl || book.image || "/images/default-book.png"}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <p className="text-xs text-gray-500 mb-3">
                    Kategori: {book.categoryName || book.category?.name || "Tidak ada kategori"}
                </p>
                <div className="text-xs text-gray-400 mb-3 space-y-1">
                    {book.publisher && <p>Penerbit: {book.publisher}</p>}
                    {book.publicationYear && <p>Tahun: {book.publicationYear}</p>}
                    {book.shelf && <p>Rak: {book.shelf}</p>}
                    {book.location && <p>Lokasi: {book.location}</p>}
                </div>
                <div className="mb-3">
          <span
              className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                  book.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {book.available ? "Tersedia" : "Dipinjam"}
          </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onEdit(book)}
                        className="flex-1 text-xs px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(book.id)}
                        className="flex-1 text-xs px-2 py-1 text-red-600 hover:text-red-900 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => onBorrow(book.id)}
                        className="flex-1 text-xs px-2 py-1 text-green-600 hover:text-green-900 border border-green-300 rounded hover:bg-green-50 transition-colors"
                        disabled={!book.available}
                    >
                        Borrow
                    </button>
                    {loan && !loan.returnedDate && (
                        <button
                            onClick={() => onReturn(loan.id)}
                            className="flex-1 text-xs px-2 py-1 text-blue-600 hover:text-blue-900 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                        >
                            Return
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
