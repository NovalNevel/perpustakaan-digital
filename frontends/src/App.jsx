import React from 'react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes />
      <ToastContainer /> {/* ✅ Tambahkan di luar Routes */}
    </>
  );
}

export default App;
