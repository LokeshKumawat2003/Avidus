import React from 'react';

const getStatusStyle = (status) => {
  if (status === 'Completed') {
    return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
  }
  if (status === 'In Progress') {
    return 'bg-sky-100 text-sky-700 ring-1 ring-sky-200';
  }
  if (status === 'Pending') {
    return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
  }
  if (status === 'Active') {
    return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
  }
  if (status === 'Inactive') {
    return 'bg-red-100 text-red-700 ring-1 ring-red-200';
  }
  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
};

const StatusBadge = ({ status }) => {
  const badgeClass = getStatusStyle(status);
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
