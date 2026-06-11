import React from 'react';
import { NavLink } from 'react-router-dom';
import { getUser, isAdmin } from '../utils/authUtils';

const navItems = [
  { to: '/tasks', label: 'Create Task' },
  { to: '/tasks/list', label: 'Task List' },
  { to: '/my-logs', label: 'My Logs' },
];

const adminItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/activity-logs', label: 'Logs' },
];

function Sidebar({ onClose } = {}) {
  const user = getUser();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Navigation</p>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-950">Workspace menu</h2>
          <p className="mt-2 text-sm text-slate-500">Quick links for tasks, logs and admin tools.</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 inline-flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-200/10'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {isAdmin() && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
          <div className="mt-4 space-y-2">
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-200/10'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
        <p className="mt-3 text-lg font-semibold">{user?.username || 'Member'}</p>
        <p className="mt-2 text-sm text-slate-300">{user?.role || 'User'}</p>
      </div>
    </div>
  );
}

export default Sidebar;
