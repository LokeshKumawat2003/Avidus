import React, { useEffect, useState } from 'react';
import { taskAPI } from '../services/api';
import { userAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [userRes, taskRes] = await Promise.all([
          userAPI.getAllUsers(),
          taskAPI.getAllTasks(),
        ]);
        setUsers(userRes.data.users);
        setTasks(taskRes.data.tasks);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950">Admin Dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">Overview of current users and task progress.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Live analytics</div>
        </div>

        {error && <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">{error}</div>}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-lg shadow-slate-200/10">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-300">Total Users</p>
            <p className="mt-4 text-3xl font-bold">{totalUsers}</p>
          </div>
          <div className="rounded-[1.75rem] bg-sky-600 p-6 text-white shadow-lg shadow-sky-500/10">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-100">Total Tasks</p>
            <p className="mt-4 text-3xl font-bold">{totalTasks}</p>
          </div>
          <div className="rounded-[1.75rem] bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/10">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-100">Completed</p>
            <p className="mt-4 text-3xl font-bold">{completedTasks}</p>
          </div>
          <div className="rounded-[1.75rem] bg-amber-500 p-6 text-white shadow-lg shadow-amber-400/10">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-100">Pending</p>
            <p className="mt-4 text-3xl font-bold">{pendingTasks}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Recent Task Monitoring</h3>
            <p className="text-sm text-slate-500">Latest activity from your task pipeline.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Loading tasks…</span>}
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Title</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Priority</th>
                <th className="px-4 py-4 text-left font-semibold">Created By</th>
                <th className="px-4 py-4 text-left font-semibold">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {tasks.slice(0, 8).map((task) => (
                <tr key={task._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-700">{task.title}</td>
                  <td className="px-4 py-4"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-4 text-slate-700">{task.priority}</td>
                  <td className="px-4 py-4 text-slate-700">{task.createdBy?.username || 'Unknown'}</td>
                  <td className="px-4 py-4 text-slate-700">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
