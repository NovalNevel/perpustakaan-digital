import React from 'react';

const Header = ({className}) => {
  return (
    <header className={`w-full py-8 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-[#012e4a] font-family-font-1">
          Perpustakaan Digital Uin Suska Riau
        </h1>
      </div>
    </header>
  );
};

export default Header;