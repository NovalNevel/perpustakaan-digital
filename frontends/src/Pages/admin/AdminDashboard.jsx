import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {SmoothCursor} from "@/components/magicui/smooth-cursor";

import ModalWrapper from "../../components/admin/ModalWrapper";
import BookForm from "../../components/admin/BookForm";
import UserForm from "../../components/admin/UserForm";
import StatsCard from "../../components/admin/StatsCard";
import TabNav from "../../components/admin/TabNav";
import BookCard from "../../components/admin/BookCard";
import UserRow from "../../components/admin/UserRow";
import LoanRow from "../../components/admin/LoanRow";

import * as AdminService from "../../services/admin";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [userLoans, setUserLoans] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userStats, setUserStats] = useState({});
    const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState(null);
    const [bookForm, setBookForm] = useState({
        title: "",
        author: "",
        publisher: "",
        publicationYear: "",
        isbn: "",
        pages: "",
        language: "",
        shelf: "",
        location: "",
        categoryName: "",
    });
    const [userForm, setUserForm] = useState({
        username: "",
        email: "",
        password: "",
        nim: "",
        faculty: "",
        studyProgram: "",
        role: "USER",
    });
    const [image, setImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (!userData) {
            toast.error("Belum login");
            navigate("/login");
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "ADMIN") {
            toast.error("Akses ditolak. Hanya admin yang diizinkan.");
            navigate("/dashboard");
            return;
        }
        setUser(parsedUser);
        loadAllData();
    }, [navigate]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [booksData, categoriesData, usersData, userLoansData, userStatsData] =
                await Promise.all([
                    AdminService.getBooks(),
                    AdminService.getCategories(),
                    AdminService.getUsers(),
                    AdminService.getUserLoans(),
                    AdminService.getUserStatistics(),
                ]);
            setBooks(booksData);
            setCategories(categoriesData);
            setUsers(usersData);
            setUserLoans(userLoansData);
            setUserStats(userStatsData);
        } catch (e) {
            toast.error("Gagal memuat data dashboard");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const resetBookForm = () => {
        setBookForm({
            title: "",
            author: "",
            publisher: "",
            publicationYear: "",
            isbn: "",
            pages: "",
            language: "",
            shelf: "",
            location: "",
            categoryName: "",
        });
        setImage(null);
        setEditId(null);
    };

    const resetUserForm = () => {
        setUserForm({
            username: "",
            email: "",
            password: "",
            nim: "",
            faculty: "",
            studyProgram: "",
            role: "USER",
        });
        setEditId(null);
    };

    const onBookChange = (e) => setBookForm({ ...bookForm, [e.target.name]: e.target.value });
    const onUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });
    const onFileChange = (e) => setImage(e.target.files[0]);

    const openAddBookModal = () => {
        resetBookForm();
        setModal("addBook");
    };
    const openEditBookModal = (book) => {
        setEditId(book.id);
        setBookForm({
            title: book.title || "",
            author: book.author || "",
            publisher: book.publisher || "",
            publicationYear: book.publicationYear || "",
            isbn: book.isbn || "",
            pages: book.pages || "",
            language: book.language || "",
            shelf: book.shelf || "",
            location: book.location || "",
            categoryName: book.categoryName || book.category?.name || "",
        });
        setModal("editBook");
    };
    const openAddUserModal = () => {
        resetUserForm();
        setModal("addUser");
    };
    const openEditUserModal = async (userId) => {
        try {
            const userData = await AdminService.getUserById(userId);
            setEditId(userId);
            setUserForm({
                username: userData.username,
                email: userData.email,
                password: "",
                nim: userData.nim,
                faculty: userData.faculty,
                studyProgram: userData.studyProgram,
                role: userData.role,
            });
            setModal("editUser");
        } catch (e) {
            toast.error("Gagal mengambil data user");
            console.error(e);
        }
    };
    const openBorrowModal = (bookId) => {
        setSelectedBookId(bookId);
        setModal("borrow");
    };
    const openReturnModal = (loanId) => {
        setSelectedBookId(loanId);
        setModal("return");
    };

    const closeModal = () => setModal(null);

    const onBookSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(bookForm).forEach(([k, v]) => formData.append(k, v));
        if (image) formData.append("image", image);
        try {
            if (editId) await AdminService.updateBook(editId, formData);
            else await AdminService.addBook(formData);
            toast.success(`Buku berhasil ${editId ? "diupdate" : "ditambahkan"}`);
            closeModal();
            resetBookForm();
            loadAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menyimpan buku");
            console.error(error);
        }
    };

    const onUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) await AdminService.updateUser(editId, userForm);
            else await AdminService.addUser(userForm);
            toast.success(`User berhasil ${editId ? "diupdate" : "ditambahkan"}`);
            closeModal();
            resetUserForm();
            loadAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menyimpan user");
            console.error(error);
        }
    };

    const onDeleteBook = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) return;
        try {
            await AdminService.deleteBook(id);
            toast.success("Buku berhasil dihapus");
            loadAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menghapus buku");
            console.error(error);
        }
    };

    const onDeleteUser = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) return;
        try {
            await AdminService.deleteUser(id);
            toast.success("User berhasil dihapus");
            loadAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menghapus user");
            console.error(error);
        }
    };

    const onBorrow = async () => {
        try {
            await AdminService.borrowBook(selectedBookId, selectedUserId);
            toast.success("Buku berhasil dipinjam");
            closeModal();
            loadAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal meminjam buku");
            console.error(error);
        }
    };

    const onReturn = async () => {
        try {
            await AdminService.returnBook(selectedBookId);
            toast.success("Buku berhasil dikembalikan");
            closeModal();
            loadAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal mengembalikan buku");
            console.error(error);
        }
    };

    const filteredBooks = books.filter(
        (book) =>
            (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory === "" ||
                book.categoryName === selectedCategory ||
                book.category?.name === selectedCategory)
    );
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.nim.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    const bookStats = {
        total: books.length,
        available: books.filter((b) => b.available).length,
        borrowed: books.filter((b) => !b.available).length,
        categories: categories.length,
    };
    const loanStats = {
        total: userLoans.length,
        active: userLoans.filter((loan) => !loan.returnedDate).length,
        returned: userLoans.filter((loan) => loan.returnedDate).length,
        overdue: userLoans.filter(
            (loan) => !loan.returnedDate && new Date() > new Date(loan.dueDate)
        ).length,
    };

    if (loading)
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-900">Memuat dashboard...</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-white max-w-7xl mx-auto p-8">
            <SmoothCursor />
            {/* Header */}
            <header className="top-0 z-10 bg-re border-b border-gray-200 mb-8">
                <div className="flex justify-between items-center h-16 px-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-600">Welcome, {user?.username}</span>
                        <button
                            onClick={() => {
                                sessionStorage.clear();
                                navigate("/login");
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <TabNav
                tabs={[
                    { id: "dashboard", label: "Overview" },
                    { id: "books", label: "Books" },
                    { id: "users", label: "Users" },
                    { id: "loans", label: "Loans" },
                ]}
                activeTab={activeTab}
                onTabClick={setActiveTab}
            />

            {/* Content */}
            {activeTab === "dashboard" && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            }
                            label="Total Books"
                            value={bookStats.total}
                            bgColor="bg-blue-100"
                        />
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            }
                            label="Available"
                            value={bookStats.available}
                            bgColor="bg-green-100"
                        />
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            }
                            label="Total Users"
                            value={userStats.totalUsers || 0}
                            bgColor="bg-purple-100"
                        />
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            label="Active Loans"
                            value={loanStats.active}
                            bgColor="bg-orange-100"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={openAddBookModal}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add New Book
                            </button>
                            <button
                                onClick={openAddUserModal}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Add New User
                            </button>
                            <button
                                onClick={() => setActiveTab("loans")}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Manage Loans
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Books Tab */}
            {activeTab === "books" && (
                <>
                    {/* Filter Section */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Book Management</h3>
                        <button
                            onClick={openAddBookModal}
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Book
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
                                <input
                                    type="text"
                                    placeholder="Search by title or author..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {filteredBooks.map((book) => {
                            const loan = userLoans.find((loan) => loan.bookId === book.id);
                            return (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    loan={loan}
                                    onEdit={openEditBookModal}
                                    onDelete={onDeleteBook}
                                    onBorrow={openBorrowModal}
                                    onReturn={openReturnModal}
                                />
                            );
                        })}
                    </div>
                    {filteredBooks.length === 0 && (
                        <p className="text-center text-gray-600 py-12">No books found matching your criteria.</p>
                    )}
                </>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
                        <button
                            onClick={openAddUserModal}
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Add User
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Admins</p>
                                    <p className="text-2xl font-bold text-gray-900">{userStats.adminUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Regular Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{userStats.regularUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onEdit={openEditUserModal}
                                    onDelete={onDeleteUser}
                                    disableDelete={user.id === parseInt(user?.userId)}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && <p className="text-center text-gray-600 py-12">No users found.</p>}
                </>
            )}

            {/* Loans Tab */}
            {activeTab === "loans" && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Loan Management</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                            label="Total Loans"
                            value={loanStats.total}
                            bgColor="bg-blue-100"
                        />
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            label="Active"
                            value={loanStats.active}
                            bgColor="bg-orange-100"
                        />
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            }
                            label="Returned"
                            value={loanStats.returned}
                            bgColor="bg-green-100"
                        />
                        <StatsCard
                            icon={
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            label="Overdue"
                            value={loanStats.overdue}
                            bgColor="bg-red-100"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {userLoans.map(loan => (
                                <LoanRow key={loan.id} loan={loan} onMarkReturned={openReturnModal} />
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {userLoans.length === 0 && <p className="text-center text-gray-600 py-12">No book loans have been recorded yet.</p>}
                </>
            )}

            {/* Modals */}
            {modal === "addBook" && (
                <ModalWrapper title="Add New Book" onClose={closeModal}>
                    <BookForm
                        formData={bookForm}
                        onChange={onBookChange}
                        onSubmit={onBookSubmit}
                        onFileChange={onFileChange}
                        submitLabel="Add Book"
                        onCancel={closeModal}
                        categories={categories}
                    />
                </ModalWrapper>
            )}
            {modal === "editBook" && (
                <ModalWrapper title="Edit Book" onClose={closeModal}>
                    <BookForm
                        formData={bookForm}
                        onChange={onBookChange}
                        onSubmit={onBookSubmit}
                        onFileChange={onFileChange}
                        submitLabel="Update Book"
                        onCancel={closeModal}
                        categories={categories}
                    />
                </ModalWrapper>
            )}
            {modal === "addUser" && (
                <ModalWrapper title="Add New User" onClose={closeModal}>
                    <UserForm
                        formData={userForm}
                        onChange={onUserChange}
                        onSubmit={onUserSubmit}
                        submitLabel="Add User"
                        onCancel={closeModal}
                    />
                </ModalWrapper>
            )}
            {modal === "editUser" && (
                <ModalWrapper title="Edit User" onClose={closeModal}>
                    <UserForm
                        formData={userForm}
                        onChange={onUserChange}
                        onSubmit={onUserSubmit}
                        submitLabel="Edit User"
                        onCancel={closeModal}
                    />
                </ModalWrapper>
            )}
            {modal === "borrow" && (
                <ModalWrapper title="Borrow Book" onClose={closeModal}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                        <select
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
                            required
                        >
                            <option value="">Choose a user...</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username} - {user.email}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onBorrow}
                                disabled={!selectedUserId}
                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Borrow Book
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}
            {modal === "return" && (
                <ModalWrapper title="Return Book" onClose={closeModal}>
                    <div>
                        <p className="text-sm text-gray-600 mb-4">Are you sure you want to mark this book as returned?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onReturn}
                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Return Book
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
};

export default AdminDashboard;