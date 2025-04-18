// components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Topbar />
      <div className="main">
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
