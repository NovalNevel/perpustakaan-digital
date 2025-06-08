import React from 'react';

const BookForm = ({ formData, onChange, onSubmit, onFileChange, submitLabel, onCancel, categories }) => (
    <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
        {[
            { label: 'Judul', name: 'title', type: 'text', required: true },
            { label: 'Pengarang', name: 'author', type: 'text', required: true },
            { label: 'Penerbit', name: 'publisher' },
            { label: 'Tahun Terbit', name: 'publicationYear', type: 'text' },
            { label: 'ISBN', name: 'isbn', type: 'text' },
            { label: 'Halaman', name: 'pages', type: 'number' },
            { label: 'Bahasa', name: 'language', type: 'text' },
            { label: 'Rak', name: 'shelf', type: 'text' },
            { label: 'Lokasi', name: 'location', type: 'text' },
        ].map(({ label, name, type = 'text', required = false }) => (
            <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required={required}
                />
            </div>
        ))}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input
                name="categoryName"
                type="text"
                value={formData.categoryName}
                list="categories"
                onChange={onChange}
                placeholder="Masukkan atau pilih kategori"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <datalist id="categories">
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                ))}
            </datalist>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sampul Buku</label>
            <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
        </div>
        <div className="flex gap-2 pt-4">
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                {submitLabel}
            </button>
        </div>
    </form>
);

export default BookForm;
