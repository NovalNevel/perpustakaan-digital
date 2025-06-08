import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/Login.jsx';
import RegisterPage from './pages/auth/Register.jsx';
import Dashboard from './pages/user/Dashboard.jsx';
import Profile from './pages/user/Profile.jsx';
import BookDetail from './pages/user/DetailBook.jsx';
import DetailList from './pages/user/DetailList.jsx';
import AdminDashboard from './Pages/admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/category/:category" element={<DetailList />} />
        <Route path="/" element={<Dashboard />} /> {/* Default route redirects to dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
