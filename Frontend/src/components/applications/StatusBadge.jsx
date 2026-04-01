import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getBadgeStyle()}`}>
      {status || 'Pending'}
    </span>
  );
};

export default StatusBadge;
