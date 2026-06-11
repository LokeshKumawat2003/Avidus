import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken, setUser } from '../utils/authUtils';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      navigate(response.data.user.role === 'Admin' ? '/admin/dashboard' : '/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
      <div className="mb-8 space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-950">Welcome back</h2>
        <p className="text-sm leading-6 text-slate-500">
          Sign in to continue managing tasks, checking activity logs, and using the Avidus dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
