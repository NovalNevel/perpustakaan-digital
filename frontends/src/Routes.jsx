import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} /> {/* Default route redirects to login */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;