// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Book,
  Users,
  UserCheck,
  BookOpen,
} from 'lucide-react';

import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';
import DashboardLayout from '../../components/Layouts/admin/dashboardLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    archivedCourses: 0,
    totalStudents: 0,
    totalFaculty: 0,
    trending: [],
    isLoading: true,
  });

  /* ------------------------------------------------------------ */
  /* load counters + trending courses                             */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      setStats((p) => ({ ...p, isLoading: true }));
      try {
        const [counters, trending] = await Promise.all([
          axiosInstance.get(API_PATHS.METRICS.DASHBOARD_STATS),
          axiosInstance.get(API_PATHS.METRICS.DASHBOARD_TRENDING),
        ]);

        const {
          totalCourses,
          activeCourses,
          archivedCourses,
          totalStudents,
          totalFaculty,
        } = counters.data;

        setStats({
          totalCourses,
          activeCourses,
          archivedCourses,
          totalStudents,
          totalFaculty,
          trending: trending.data,
          isLoading: false,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
        setStats((p) => ({ ...p, isLoading: false }));
      }
    })();
  }, []);

  /* ------------------------------------------------------------ */
  /* UI                                                           */
  /* ------------------------------------------------------------ */
  if (stats.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-80">
          <span className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10">
        {/* header */}
        <header>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Quick glance at how your institution is doing today.
          </p>
        </header>

        {/* cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Courses */}
          <StatCard
            iconBg="bg-blue-100"
            icon={<BookOpen size={20} className="text-blue-600" />}
            value={stats.totalCourses}
            label="total courses"
            extra={`${stats.activeCourses} active • ${stats.archivedCourses} archived`}
          />

          {/* Students */}
          <StatCard
            iconBg="bg-green-100"
            icon={<Users size={20} className="text-green-600" />}
            value={stats.totalStudents}
            label="enrolled students"
            link={{ to: '/admin/students', text: 'View all students' }}
          />

          {/* Faculty */}
          <StatCard
            iconBg="bg-purple-100"
            icon={<UserCheck size={20} className="text-purple-600" />}
            value={stats.totalFaculty}
            label="faculty members"
            link={{ to: '/admin/faculties', text: 'View all faculty' }}
          />
        </section>

        {/* quick actions */}
        <QuickActions />

        {/* trending courses */}
        <section className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              Trending Courses
            </h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {stats.trending.map((c) => (
              <li key={c.id} className="flex justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {c.code} — {c.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {c.enrolled} students enrolled
                  </p>
                </div>
                <Link
                  to={`/admin/courses/${c.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Details <ChevronRight size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
};

/* ─────────── small reusable components ─────────── */
const StatCard = ({ iconBg, icon, value, label, extra, link }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-600 text-sm uppercase font-semibold tracking-wider">
        {label.split(' ')[0]}
      </h3>
      <div className={`${iconBg} p-2 rounded-full`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
    {extra && <p className="mt-2 text-sm text-gray-500">{extra}</p>}
    {link && (
      <div className="mt-4">
        <Link
          to={link.to}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {link.text} <ChevronRight size={16} />
        </Link>
      </div>
    )}
  </div>
);

const QuickActions = () => (
  <section className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickLink to="/admin/courses/new" icon={Book} text="Add New Course" color="blue" />
      <QuickLink to="/admin/students/new" icon={Users} text="Add New Student" color="green" />
      <QuickLink to="/admin/faculty/new" icon={UserCheck} text="Add New Faculty" color="purple" />
      <QuickLink to="/admin/courses" icon={BookOpen} text="Manage Courses" color="gray" />
    </div>
  </section>
);

const QuickLink = ({ to, icon: Icon, text, color }) => (
  <Link
    to={to}
    className={`flex items-center justify-center p-4 bg-${color}-50 hover:bg-${color}-100 text-${color}-700 rounded-md transition-colors`}
  >
    <Icon className="mr-2" size={20} />
    <span>{text}</span>
  </Link>
);

export default AdminDashboard;
