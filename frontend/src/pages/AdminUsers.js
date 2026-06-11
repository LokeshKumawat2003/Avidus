import React, { useEffect, useState } from 'react';
import { userAPI, taskAPI, activityLogAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data.users || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await userAPI.updateUserStatus(user._id, newStatus);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status');
    }
  };

  const changeRole = async (userId, role) => {
    try {
      await userAPI.updateUserRole(userId, role);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update role');
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user');
    }
  };

  const viewUserTasks = async (userId) => {
    setError('');
    try {
      const res = await taskAPI.getTasksByUser(userId);
      setSelectedTasks(res.data.tasks || []);
      setShowTasksModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load user tasks');
    }
  };

  const viewUserLogs = async (userId) => {
    setError('');
    try {
      const res = await activityLogAPI.getActivityLogs({ userId });
      setSelectedLogs(res.data.logs || []);
      setShowLogsModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load activity logs');
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950">User Management</h2>
            <p className="mt-1 text-sm text-slate-500">Approve roles, activate accounts, and keep your team in sync.</p>
          </div>
          <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{users.length} users</span>
        </div>

        {error && <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">{error}</div>}

        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Username</th>
                <th className="px-4 py-4 text-left font-semibold">Email</th>
                <th className="px-4 py-4 text-left font-semibold">Role</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-700">{user.username}</td>
                  <td className="px-4 py-4 text-slate-700">{user.email}</td>
                  <td className="px-4 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                  <td className="flex flex-wrap gap-2 px-4 py-4">
                    <button
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      onClick={() => toggleStatus(user)}
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      onClick={() => removeUser(user._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => viewUserTasks(user._id)}
                    >
                      View Tasks
                    </button>
                    <button
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => viewUserLogs(user._id)}
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks modal */}
      {showTasksModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">User Tasks</h3>
              <button onClick={() => setShowTasksModal(false)} className="text-sm text-slate-600">Close</button>
            </div>
            <div className="mt-4">
              {selectedTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks found for this user.</p>
              ) : (
                <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-950 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Priority</th>
                        <th className="px-4 py-3 text-left">Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {selectedTasks.map((t) => (
                        <tr key={t._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-700">{t.title}</td>
                          <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                          <td className="px-4 py-3 text-slate-700">{t.priority}</td>
                          <td className="px-4 py-3 text-slate-700">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logs modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">User Activity Logs</h3>
              <button onClick={() => setShowLogsModal(false)} className="text-sm text-slate-600">Close</button>
            </div>
            <div className="mt-4">
              {selectedLogs.length === 0 ? (
                <p className="text-sm text-slate-500">No activity logs for this user.</p>
              ) : (
                <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-950 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Action</th>
                        <th className="px-4 py-3 text-left">Details</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {selectedLogs.map((l) => (
                        <tr key={l._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-700">{l.action}</td>
                          <td className="px-4 py-3 text-slate-700">{l.details || '—'}</td>
                          <td className="px-4 py-3 text-slate-700">{new Date(l.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
