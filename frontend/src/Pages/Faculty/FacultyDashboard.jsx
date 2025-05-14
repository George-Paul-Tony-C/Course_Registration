import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Bell, 
  BarChart2, 
  PieChart,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import FacultyDashboardLayout from '../../components/Layouts/faculty/FacultyDashboardLayout';

const FacultyDashboard = () => {
  const [notifications] = useState([
    { id: 1, message: "Assignment submissions due today", time: "2 hours ago", unread: true },
    { id: 2, message: "New student enrolled in Advanced Database", time: "5 hours ago", unread: true },
    { id: 3, message: "Department meeting scheduled for tomorrow", time: "Yesterday", unread: false },
    { id: 4, message: "Curriculum review feedback requested", time: "2 days ago", unread: false },
  ]);

  const [courses] = useState([
    { id: 1, name: "Introduction to Programming", students: 45, averageScore: 78 },
    { id: 2, name: "Data Structures", students: 38, averageScore: 72 },
    { id: 3, name: "Advanced Database Systems", students: 27, averageScore: 81 },
    { id: 4, name: "Machine Learning Fundamentals", students: 32, averageScore: 76 },
  ]);

  const [upcomingEvents] = useState([
    { id: 1, title: "Office Hours", date: "Today, 2:00 PM - 4:00 PM", location: "Room 302" },
    { id: 2, title: "Department Meeting", date: "Tomorrow, 10:00 AM", location: "Conference Room B" },
    { id: 3, title: "Project Presentations", date: "May 5, 1:00 PM", location: "Auditorium" },
  ]);

  const [tasks] = useState([
    { id: 1, title: "Grade Programming Assignments", deadline: "Today", status: "pending", priority: "high" },
    { id: 2, title: "Prepare Lecture Notes", deadline: "Tomorrow", status: "in-progress", priority: "medium" },
    { id: 3, title: "Update Course Syllabus", deadline: "May 3", status: "completed", priority: "low" },
    { id: 4, title: "Review Research Papers", deadline: "May 7", status: "pending", priority: "medium" },
  ]);

  // Calculate faculty statistics
  const totalStudents = courses.reduce((acc, course) => acc + course.students, 0);
  const totalCourses = courses.length;
  const overallAverage = courses.reduce((acc, course) => acc + course.averageScore, 0) / totalCourses;

  // Mock data for charts
  const studentProgressData = [
    { name: 'Excellent', value: 30 },
    { name: 'Good', value: 45 },
    { name: 'Average', value: 15 },
    { name: 'Below Average', value: 10 },
  ];

  const monthlyPerformanceData = [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 78 },
    { month: 'May', score: 82 },
  ];

  return (
    <FacultyDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>
          <p className="text-gray-600">Welcome back, Professor Johnson!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-xl font-bold">{totalCourses}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-xl font-bold">{totalStudents}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="text-xl font-bold">{overallAverage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Student Progress</p>
              <p className="text-xl font-bold">+12%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Courses Overview */}
          <div className="bg-white rounded-lg shadow col-span-2">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Course Overview</h2>
              <button className="text-blue-500 text-sm">View All</button>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Course Name</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Students</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Avg. Score</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id} className="border-t">
                        <td className="py-3 px-4 text-gray-800">{course.name}</td>
                        <td className="py-3 px-4 text-gray-800">{course.students}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              course.averageScore >= 80 ? 'text-green-600' : 
                              course.averageScore >= 70 ? 'text-blue-600' : 
                              'text-yellow-600'
                            }`}>
                              {course.averageScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Notifications</h2>
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notifications.filter(n => n.unread).length} new
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg ${notification.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex justify-between">
                      <p className={`${notification.unread ? 'font-semibold' : ''} text-gray-800`}>
                        {notification.message}
                      </p>
                      {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                View All Notifications
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <h2 className="font-bold text-gray-800">Student Performance Trend</h2>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <BarChart2 size={48} className="text-blue-300 mb-2" />
                <p className="text-gray-500 text-sm text-center">
                  Performance chart showing monthly average scores
                </p>
                <div className="flex mt-4 space-x-4">
                  {monthlyPerformanceData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500" 
                        style={{ 
                          height: `${item.score}px`, 
                          width: '20px',
                          borderRadius: '3px'
                        }}
                      ></div>
                      <span className="text-xs mt-1 text-gray-500">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Student Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <h2 className="font-bold text-gray-800">Student Distribution</h2>
            </div>
            <div className="p-4 h-64 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-4">
                <PieChart size={48} className="text-purple-300" />
              </div>
              <p className="text-gray-500 text-sm text-center mb-4">
                Distribution of students by performance level
              </p>
              <div className="grid grid-cols-2 gap-2 w-full">
                {studentProgressData.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      idx === 0 ? 'bg-green-500' : 
                      idx === 1 ? 'bg-blue-500' : 
                      idx === 2 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-gray-600">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Upcoming Events</h2>
              <Calendar size={20} className="text-gray-500" />
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {event.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                View Calendar
              </button>
            </div>
          </div>

          {/* To-Do List */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">To-Do List</h2>
              <button className="text-sm text-blue-500">+ Add Task</button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center">
                      {task.status === "completed" ? (
                        <CheckCircle size={18} className="text-green-500 mr-3" />
                      ) : task.priority === "high" ? (
                        <AlertTriangle size={18} className="text-red-500 mr-3" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                      )}
                      <div>
                        <p className={`text-sm ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "high" ? "bg-red-100 text-red-800" :
                      task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </FacultyDashboardLayout>
  );
};

export default FacultyDashboard;