import React from 'react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify'; // ✅ Tambahkan ini
import 'react-toastify/dist/ReactToastify.css';  // ✅ Tambahkan ini juga (styling)

function App() {
  return (
    <>
      <Routes />
      <ToastContainer /> {/* ✅ Tambahkan di luar Routes */}
    </>
  );
}

export default App;
