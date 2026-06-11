import React, { useEffect, useState } from 'react';
import { activityLogAPI } from '../services/api';

function MyLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await activityLogAPI.getUserActivityLogs({ limit: 100 });
      setLogs(response.data.logs);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950">My Activity Logs</h2>
            <p className="mt-1 text-sm text-slate-500">All your recent task activity in one place.</p>
          </div>
          <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">User history</span>
        </div>

        {error && <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">{error}</div>}

        {loading ? (
          <p className="mt-8 text-sm text-slate-500">Loading your logs...</p>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Action</th>
                  <th className="px-4 py-4 text-left font-semibold">Task</th>
                  <th className="px-4 py-4 text-left font-semibold">Details</th>
                  <th className="px-4 py-4 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
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

export default MyLogs;
