import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';
import DashboardLayout from '../../components/Layouts/dashboardLayout';
import { ChevronRight, Book, Users, UserCheck, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    archivedCourses: 0,
    totalStudents: 0,
    totalFaculty: 0,
    recentActivities: [],
    isLoading: true
  });

  // Sample data for demonstration
  // In a real application, this would come from API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In production, you would make actual API calls here
        // For now using mock data
        
        // Simulate API call delay
        setTimeout(() => {
          setStats({
            totalCourses: 24,
            activeCourses: 18,
            archivedCourses: 6,
            totalStudents: 450,
            totalFaculty: 32,
            recentActivities: [
              { id: 1, type: 'course', action: 'created', title: 'Web Development', user: 'Admin', timestamp: '2025-04-28T10:30:00Z' },
              { id: 2, type: 'student', action: 'enrolled', title: 'John Doe enrolled in AI Fundamentals', user: 'John Doe', timestamp: '2025-04-28T09:45:00Z' },
              { id: 3, type: 'faculty', action: 'assigned', title: 'Prof. Smith assigned to Database Systems', user: 'Prof. Smith', timestamp: '2025-04-27T16:20:00Z' },
              { id: 4, type: 'course', action: 'updated', title: 'Machine Learning', user: 'Admin', timestamp: '2025-04-27T14:15:00Z' },
              { id: 5, type: 'course', action: 'archived', title: 'Artificial Intelligence', user: 'Admin', timestamp: '2025-04-26T11:30:00Z' },
            ],
            isLoading: false
          });
        }, 1000);
        
        // Uncomment this section when you have real API endpoints
        /*
        const courseResponse = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD_STATS);
        const activityResponse = await axiosInstance.get(API_PATHS.ADMIN.RECENT_ACTIVITIES);
        
        setStats({
          ...courseResponse.data,
          recentActivities: activityResponse.data,
          isLoading: false
        });
        */
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'course':
        return <Book size={18} className="text-blue-500" />;
      case 'student':
        return <Users size={18} className="text-green-500" />;
      case 'faculty':
        return <UserCheck size={18} className="text-purple-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin! Here's what's happening in your institution.</p>
        </div>

        {stats.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-600 text-sm uppercase font-semibold tracking-wider">Courses</h2>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
                  <p className="ml-2 text-sm text-gray-600">total courses</p>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <span className="text-green-500 font-medium">{stats.activeCourses}</span> Active
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">{stats.archivedCourses}</span> Archived
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-600 text-sm uppercase font-semibold tracking-wider">Students</h2>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  <p className="ml-2 text-sm text-gray-600">enrolled students</p>
                </div>
                <div className="mt-4">
                  <Link to="/admin/students" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View all students <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-600 text-sm uppercase font-semibold tracking-wider">Faculty</h2>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <UserCheck size={20} className="text-purple-600" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalFaculty}</p>
                  <p className="ml-2 text-sm text-gray-600">faculty members</p>
                </div>
                <div className="mt-4">
                  <Link to="/admin/faculties" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View all faculty <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/courses/create" className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors">
                  <Book className="mr-2" size={20} />
                  <span>Add New Course</span>
                </Link>
                <Link to="/admin/students/create" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors">
                  <Users className="mr-2" size={20} />
                  <span>Add New Student</span>
                </Link>
                <Link to="/admin/faculty/create" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors">
                  <UserCheck className="mr-2" size={20} />
                  <span>Add New Faculty</span>
                </Link>
                <Link to="/admin/courses" className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">
                  <BookOpen className="mr-2" size={20} />
                  <span>Manage Courses</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start">
                    <div className="mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-500">by {activity.user}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                ))}
                <div className="p-4 text-center">
                  <Link to="/admin/activities" className="text-sm text-blue-600 hover:text-blue-800">
                    View all activity
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;