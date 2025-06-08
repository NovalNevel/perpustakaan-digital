import React from 'react';

const ModalWrapper = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    </div>
);

export default ModalWrapper;
