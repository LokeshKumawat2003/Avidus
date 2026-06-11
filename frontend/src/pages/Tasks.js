import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { taskAPI, userAPI } from '../services/api';
import { getUser, isAdmin } from '../utils/authUtils';

const initialFormData = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Pending',
  assignedTo: '',
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const user = getUser();
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      // ignore user list errors for now
    }
  };

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
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && !editingTaskId) {
      const currentUser = users.find((u) => u._id === user?._id);
      if (currentUser) {
        setFormData((prev) => ({ ...prev, assignedTo: currentUser._id }));
      }
    }
  }, [users, editingTaskId, user]);

  const resetForm = () => {
    const currentUser = users.find((u) => u._id === user?._id);
    setFormData({
      ...initialFormData,
      assignedTo: currentUser?._id || '',
    });
    setEditingTaskId(null);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo || null,
      };

      if (editingTaskId) {
        await taskAPI.updateTask(editingTaskId, payload);
        setSuccess('Task updated successfully');
      } else {
        await taskAPI.createTask(payload);
        setSuccess('Task created successfully');
      }

      resetForm();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save task');
    } finally {
      setSaving(false);
    }
  };

  const editTask = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo?._id || '',
    });
    setSuccess('');
    setError('');
  };

  useEffect(() => {
    if (location.state?.task) {
      editTask(location.state.task);
    }
  }, [location.state]);

  const removeTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    setError('');

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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;

  return (
    <div className="space-y-10">
      <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Task workspace</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950">Create or update your task</h2>
              <p className="mt-2 text-sm text-slate-500">Build tasks faster with a clean dashboard form and quick action flow.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/tasks/list"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View task list
              </Link>
              <div className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
                {editingTaskId ? 'Editing task' : 'New task'}
              </div>
            </div>
          </div>

          {error && <div className="mb-5 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">{error}</div>}
          {success && <div className="mb-5 rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  placeholder="Type task title"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Due date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[150px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Describe the task details"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Assign to</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username} {u.email ? `(${u.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {saving ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task'}
              </button>
              {editingTaskId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/10">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.75rem] bg-slate-900 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Total Tasks</p>
              <p className="mt-4 text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="rounded-[1.75rem] bg-sky-600 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-100">Completed</p>
              <p className="mt-4 text-3xl font-bold">{completedTasks}</p>
            </div>
            <div className="rounded-[1.75rem] bg-amber-500 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-100">Pending</p>
              <p className="mt-4 text-3xl font-bold">{pendingTasks}</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-700 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">In Progress</p>
              <p className="mt-4 text-3xl font-bold">{inProgressTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Task summary</h3>
            <p className="text-sm text-slate-500">Track your load and open the dedicated task list page for full management.</p>
          </div>
          <Link
            to="/tasks/list"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open task list
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Total Tasks</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{totalTasks}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-sky-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Completed</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{completedTasks}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-amber-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Pending</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">{pendingTasks}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-900 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">In Progress</p>
            <p className="mt-4 text-3xl font-bold">{inProgressTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
