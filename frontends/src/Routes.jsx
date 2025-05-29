import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import BookDetail from './Pages/DetailBook';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/" element={<Dashboard />} /> {/* Default route redirects to dashboard */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
