import React from 'react';

const BookForm = ({ formData, onChange, onSubmit, onFileChange, submitLabel, onCancel, categories }) => (
    <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
        {[
            { label: 'Title', name: 'title', type: 'text', required: true },
            { label: 'Author', name: 'author', type: 'text', required: true },
            { label: 'Publisher', name: 'publisher' },
            { label: 'Year', name: 'publicationYear', type: 'text' },
            { label: 'ISBN', name: 'isbn', type: 'text' },
            { label: 'Pages', name: 'pages', type: 'number' },
            { label: 'Language', name: 'language', type: 'text' },
            { label: 'Shelf', name: 'shelf', type: 'text' },
            { label: 'Location', name: 'location', type: 'text' },
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
                name="categoryName"
                type="text"
                value={formData.categoryName}
                list="categories"
                onChange={onChange}
                placeholder="Enter or select category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <datalist id="categories">
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                ))}
            </datalist>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover</label>
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
