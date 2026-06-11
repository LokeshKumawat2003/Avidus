import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SidebarLayout from './components/SidebarLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import TaskList from './pages/TaskList';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import ActivityLogs from './pages/ActivityLogs';
import MyLogs from './pages/MyLogs';
import NotFound from './pages/NotFound';
import { getUser, isAuthenticated } from './utils/authUtils';

function App() {
  const redirectPath = () => {
    if (!isAuthenticated()) return '/login';
    const user = getUser();
    return user?.role === 'Admin' ? '/admin/dashboard' : '/tasks';
  };

  return (
    <Router>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to={redirectPath()} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <Tasks />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/list"
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <TaskList />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-logs"
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <MyLogs />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <SidebarLayout>
                  <AdminDashboard />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <SidebarLayout>
                  <AdminUsers />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              <ProtectedRoute adminOnly>
                <SidebarLayout>
                  <ActivityLogs />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
