import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse',
  };

  const icons = {
    COMPLETED: <CheckCircle className="w-4 h-4 mr-1.5" />,
    FAILED: <XCircle className="w-4 h-4 mr-1.5" />,
    PENDING: <Clock className="w-4 h-4 mr-1.5" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default StatusBadge;
