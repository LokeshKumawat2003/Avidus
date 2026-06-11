import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/authUtils';

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 border-b border-slate-900/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
          Avidus
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {user ? (
            <>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
                Welcome, {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
