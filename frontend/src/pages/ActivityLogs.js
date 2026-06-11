import React, { useEffect, useState } from 'react';
import { activityLogAPI } from '../services/api';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = filter ? { action: filter } : {};
      const response = await activityLogAPI.getActivityLogs(params);
      setLogs(response.data.logs);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950">Activity Logs</h2>
            <p className="mt-1 text-sm text-slate-500">Track user and task activity across the system.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Filter by action</div>
        </div>

        {error && <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">{error}</div>}

        <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px] items-end">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Activity type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">All actions</option>
              <option value="Login">Login</option>
              <option value="Task Created">Task Created</option>
              <option value="Task Updated">Task Updated</option>
              <option value="Task Deleted">Task Deleted</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-slate-500">Loading logs...</p>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">User</th>
                  <th className="px-4 py-4 text-left font-semibold">Action</th>
                  <th className="px-4 py-4 text-left font-semibold">Task</th>
                  <th className="px-4 py-4 text-left font-semibold">Details</th>
                  <th className="px-4 py-4 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-700">{log.userId?.username || 'Unknown'}</td>
                    <td className="px-4 py-4 text-slate-700">{log.action}</td>
                    <td className="px-4 py-4 text-slate-700">{log.taskId?.title || 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-700">{log.details || '—'}</td>
                    <td className="px-4 py-4 text-slate-700">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityLogs;
