import React from 'react';

const UserForm = ({ formData, onChange, onSubmit, submitLabel, onCancel }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        {[
            { label: 'Username', name: 'username', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Password', name: 'password', type: 'password', required: submitLabel === 'Add User' },
            { label: 'NIM', name: 'nim', type: 'text', required: true },
            { label: 'Faculty', name: 'faculty', type: 'text', required: true },
            { label: 'Study Program', name: 'studyProgram', type: 'text', required: true },
        ].map(({ label, name, type, required }) => (
            <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={onChange}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder={type === 'password' && submitLabel === 'Edit User' ? 'Leave blank to keep current password' : ''}
                />
            </div>
        ))}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
                name="role"
                value={formData.role}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
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

export default UserForm;
