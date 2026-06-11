import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { getUser, isAdmin } from '../utils/authUtils';
import StatusBadge from '../components/StatusBadge';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = getUser();

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await (isAdmin() ? taskAPI.getAllTasks() : taskAPI.getUserTasks());
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const removeTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    setError('');
    setSuccess('');

    try {
      await taskAPI.deleteTask(taskId);
      setSuccess('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task');
    }
  };

  const canModify = (task) => {
    return task.createdBy?._id === user?._id || isAdmin();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Task list</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950">All tasks in one place</h2>
          <p className="mt-2 text-sm text-slate-500">Browse and manage your task table on a dedicated page.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/tasks"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Create Task
          </Link>
          <button
            type="button"
            onClick={fetchTasks}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">{error}</div>}
      {success && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">{success}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-lg shadow-slate-200/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Total Tasks</p>
          <p className="mt-4 text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-sky-600 p-6 text-white shadow-lg shadow-sky-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">Completed</p>
          <p className="mt-4 text-3xl font-bold">{tasks.filter((task) => task.status === 'Completed').length}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-amber-500 p-6 text-white shadow-lg shadow-amber-400/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">Pending</p>
          <p className="mt-4 text-3xl font-bold">{tasks.filter((task) => task.status === 'Pending').length}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-700 p-6 text-white shadow-lg shadow-slate-800/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">In Progress</p>
          <p className="mt-4 text-3xl font-bold">{tasks.filter((task) => task.status === 'In Progress').length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Title</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Priority</th>
              <th className="px-4 py-4 text-left font-semibold">Assigned To</th>
              <th className="px-4 py-4 text-left font-semibold">Due</th>
              <th className="px-4 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">No tasks available yet.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-700">{task.title}</td>
                  <td className="px-4 py-4"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-4 text-slate-700">{task.priority}</td>
                  <td className="px-4 py-4 text-slate-700">{task.assignedTo?.username || '—'}</td>
                  <td className="px-4 py-4 text-slate-700">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                  <td className="flex flex-wrap gap-2 px-4 py-4">
                    {canModify(task) ? (
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to="/tasks"
                          state={{ task }}
                          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeTask(task._id)}
                          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Read only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;
