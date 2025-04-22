// src/pages/Pedidos/components/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;