import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBox = ({ searchTerm, setSearchTerm, onSearch, placeholder }) => {
    return (
        <div className="search-box">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-search" onClick={onSearch}>
                <FiSearch />
            </button>
        </div>
    );
};

export default SearchBox;