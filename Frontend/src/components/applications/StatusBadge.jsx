import React from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoTimeOutline } from 'react-icons/io5';

const StatusBadge = ({ status }) => {
  const config = {
    shortlisted: {
      style: 'bg-green-50 text-green-700 border-green-200',
      icon: <IoCheckmarkCircle className="shrink-0" />,
      label: 'Shortlisted',
    },
    rejected: {
      style: 'bg-red-50 text-red-600 border-red-200',
      icon: <IoCloseCircle className="shrink-0" />,
      label: 'Rejected',
    },
    applied: {
      style: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: <IoTimeOutline className="shrink-0" />,
      label: 'Pending',
    },
  };

  const key = status?.toLowerCase();
  const { style, icon, label } = config[key] || config.applied;

  return (
    <span className={`px-3 py-1.5 text-xs font-bold rounded-full border flex items-center gap-1.5 w-max ${style}`}>
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
