import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white/95 p-10 text-center shadow-2xl shadow-slate-200/40">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">404 error</p>
      <h2 className="mt-6 text-4xl font-extrabold text-slate-950">Page not found</h2>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        The page you are looking for could not be found. Please check the URL or head back to the dashboard.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
