import React from "react";

const UserRow = ({ user, onEdit, onDelete, disableDelete }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{user.username?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{user.email}</div>
            <div className="text-sm text-gray-500">NIM: {user.nim}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{user.faculty}</div>
            <div className="text-sm text-gray-500">{user.studyProgram}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
      <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
          }`}
      >
        {user.role}
      </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button onClick={() => onEdit(user.id)} className="text-gray-600 hover:text-gray-900 transition-colors">
                Edit
            </button>
            <button
                onClick={() => onDelete(user.id)}
                className="text-red-600 hover:text-red-900 transition-colors"
                disabled={disableDelete}
            >
                Delete
            </button>
        </td>
    </tr>
);

export default UserRow;
