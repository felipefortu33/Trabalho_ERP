// src/pages/Pedidos/components/SearchBox.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBox = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="search-box">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;