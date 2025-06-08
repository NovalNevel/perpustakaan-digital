import React from "react";

const LoanRow = ({ loan, onMarkReturned }) => {
    const isOverdue = !loan.returnedDate && new Date() > new Date(loan.dueDate);

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img src={loan.book?.imageUrl || "/images/default-book.png"} alt={loan.book?.title} className="h-10 w-10 rounded object-cover" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{loan.book?.title}</div>
                        <div className="text-sm text-gray-500">{loan.book?.author}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">User ID: {loan.userId}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>Borrowed: {new Date(loan.borrowedDate).toLocaleDateString()}</div>
                <div>Due: {new Date(loan.dueDate).toLocaleDateString()}</div>
                {loan.returnedDate && <div>Returned: {new Date(loan.returnedDate).toLocaleDateString()}</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                loan.returnedDate ? "bg-green-100 text-green-800" : isOverdue ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {loan.returnedDate ? "Returned" : isOverdue ? "Overdue" : "Active"}
        </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {!loan.returnedDate && (
                    <button onClick={() => onMarkReturned(loan.id)} className="text-blue-600 hover:text-blue-900 transition-colors">
                        Mark Returned
                    </button>
                )}
            </td>
        </tr>
    );
};

export default LoanRow;
