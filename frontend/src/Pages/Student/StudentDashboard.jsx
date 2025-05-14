import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText, 
  Award, 
  TrendingUp,
  Bell,
  BookMarked,
  GraduationCap,
  Users,
  Star
} from 'lucide-react';
import StudentDashboardLayout from '../../components/Layouts/student/StudentDashboardLayout';

const StudentDashboard = () => {
  const [courses] = useState([
    { 
      id: 1, 
      name: "Introduction to Programming", 
      code: "CS101", 
      instructor: "Prof. Johnson", 
      progress: 65, 
      nextClass: "Today, 2:00 PM", 
      room: "Room 302",
      grade: "B+"
    },
    { 
      id: 2, 
      name: "Data Structures", 
      code: "CS201", 
      instructor: "Dr. Smith", 
      progress: 42, 
      nextClass: "Tomorrow, 10:00 AM", 
      room: "Lab 201",
      grade: "A-"
    },
    { 
      id: 3, 
      name: "Advanced Database Systems", 
      code: "CS305", 
      instructor: "Prof. Garcia", 
      progress: 78, 
      nextClass: "Wednesday, 1:00 PM", 
      room: "Room 405",
      grade: "B"
    },
    { 
      id: 4, 
      name: "Machine Learning Fundamentals", 
      code: "CS450", 
      instructor: "Dr. Wilson", 
      progress: 31, 
      nextClass: "Thursday, 3:30 PM", 
      room: "Lab 105",
      grade: "B+"
    },
  ]);

  const [assignments] = useState([
    { 
      id: 1, 
      title: "Programming Assignment 3", 
      course: "CS101", 
      deadline: "Today, 11:59 PM", 
      status: "in-progress", 
      priority: "high" 
    },
    { 
      id: 2, 
      title: "Database Design Project", 
      course: "CS305", 
      deadline: "May 5, 11:59 PM", 
      status: "not-started", 
      priority: "medium" 
    },
    { 
      id: 3, 
      title: "Data Structures Lab 5", 
      course: "CS201", 
      deadline: "May 8, 5:00 PM", 
      status: "not-started", 
      priority: "medium" 
    },
    { 
      id: 4, 
      title: "Machine Learning Quiz", 
      course: "CS450", 
      deadline: "May 3, 3:30 PM", 
      status: "not-started", 
      priority: "high" 
    },
    { 
      id: 5, 
      title: "Programming Quiz 2", 
      course: "CS101", 
      deadline: "April 28, 11:59 PM", 
      status: "completed", 
      priority: "medium" 
    },
  ]);

  const [schedule] = useState([
    { 
      id: 1, 
      title: "Introduction to Programming", 
      code: "CS101",
      time: "2:00 PM - 3:30 PM", 
      location: "Room 302",
      type: "class"
    },
    { 
      id: 2, 
      title: "Study Group: Database Systems", 
      time: "4:00 PM - 5:30 PM", 
      location: "Library",
      type: "study"
    },
    { 
      id: 3, 
      title: "Data Structures", 
      code: "CS201",
      time: "10:00 AM - 11:30 AM", 
      location: "Lab 201",
      type: "class",
      tomorrow: true
    },
    { 
      id: 4, 
      title: "Academic Advisor Meeting", 
      time: "1:00 PM - 1:30 PM", 
      location: "Admin Building",
      type: "meeting",
      tomorrow: true
    },
  ]);

  const [notifications] = useState([
    { 
      id: 1, 
      message: "New announcement in CS101", 
      time: "1 hour ago", 
      unread: true 
    },
    { 
      id: 2, 
      message: "Your assignment 'Data Structures Lab 4' has been graded", 
      time: "3 hours ago", 
      unread: true 
    },
    { 
      id: 3, 
      message: "Prof. Garcia posted new materials in CS305", 
      time: "Yesterday", 
      unread: false 
    },
    { 
      id: 4, 
      message: "Quiz reminder: Machine Learning Quiz on May 3", 
      time: "Yesterday", 
      unread: false 
    },
  ]);

  const [resources] = useState([
    { 
      id: 1, 
      title: "Programming Fundamentals Video Series", 
      course: "CS101", 
      type: "video",
      recommended: true
    },
    { 
      id: 2, 
      title: "Data Structures Practice Problems", 
      course: "CS201", 
      type: "practice",
      recommended: true
    },
    { 
      id: 3, 
      title: "SQL Tutorial", 
      course: "CS305", 
      type: "tutorial",
      recommended: false
    },
    { 
      id: 4, 
      title: "Machine Learning Paper", 
      course: "CS450", 
      type: "reading",
      recommended: true
    },
  ]);

  // Calculate student statistics
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const totalAssignments = assignments.length;
  const completionRate = Math.round((completedAssignments / totalAssignments) * 100);

  // Calculate GPA
  const gradePoints = {
    'A+': 4.3, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };
  
  const totalPoints = courses.reduce((acc, course) => acc + (gradePoints[course.grade] || 0), 0);
  const gpa = (totalPoints / courses.length).toFixed(2);

  // Progress calculation for semester
  const semesterProgress = 60; // Percentage through current semester

  return (
    <StudentDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, Alex! Your learning journey continues.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Enrolled Courses</p>
              <p className="text-xl font-bold">{courses.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Award className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current GPA</p>
              <p className="text-xl font-bold">{gpa}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Assignment Completion</p>
              <p className="text-xl font-bold">{completionRate}%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Semester Progress</p>
              <p className="text-xl font-bold">{semesterProgress}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Courses Overview */}
          <div className="bg-white rounded-lg shadow col-span-2">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">My Courses</h2>
              <button className="text-blue-500 text-sm">View All</button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{course.code}: {course.name}</h3>
                        <p className="text-sm text-gray-500">{course.instructor}</p>
                      </div>
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {course.grade}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Course Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-xs text-gray-600">
                      <Clock size={14} className="mr-1" />
                      <span>Next class: {course.nextClass} • {course.room}</span>
                    </div>
                  </div>
                ))}
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
                      <p className={`${notification.unread ? 'font-semibold' : ''} text-sm text-gray-800`}>
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
          {/* Assignments */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Upcoming Assignments</h2>
              <button className="text-blue-500 text-sm">View All</button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {assignments.filter(a => a.status !== "completed").slice(0, 4).map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      {assignment.status === "completed" ? (
                        <CheckCircle size={18} className="text-green-500 mr-3" />
                      ) : assignment.priority === "high" ? (
                        <AlertTriangle size={18} className="text-red-500 mr-3" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                      )}
                      <div>
                        <p className="text-sm text-gray-800 font-medium">{assignment.title}</p>
                        <p className="text-xs text-gray-500">{assignment.course} • Due: {assignment.deadline}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      assignment.priority === "high" ? "bg-red-100 text-red-800" :
                      assignment.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {assignment.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Today's Schedule</h2>
              <Calendar size={20} className="text-gray-500" />
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {schedule.filter(event => !event.tomorrow).map(event => (
                  <div key={event.id} className={`border-l-4 pl-3 py-2 ${
                    event.type === "class" ? "border-blue-500" :
                    event.type === "study" ? "border-green-500" :
                    "border-purple-500"
                  }`}>
                    <h3 className="font-medium text-gray-800">
                      {event.title}
                      {event.code && <span className="ml-2 text-sm text-gray-500">{event.code}</span>}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {event.location}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tomorrow</h3>
                  {schedule.filter(event => event.tomorrow).map(event => (
                    <div key={event.id} className="mb-3 pl-3 py-1 flex items-center text-gray-600 text-sm">
                      <span className={`mr-2 w-2 h-2 rounded-full ${
                        event.type === "class" ? "bg-blue-500" :
                        event.type === "study" ? "bg-green-500" :
                        "bg-purple-500"
                      }`}></span>
                      <span>{event.time}</span>
                      <span className="mx-2">•</span>
                      <span>{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                View Full Calendar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Resources */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <h2 className="font-bold text-gray-800">Recommended Resources</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {resources.filter(r => r.recommended).map(resource => (
                  <div key={resource.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center">
                      {resource.type === "video" ? (
                        <div className="rounded-full bg-red-100 p-2 mr-3">
                          <BookMarked size={16} className="text-red-600" />
                        </div>
                      ) : resource.type === "practice" ? (
                        <div className="rounded-full bg-green-100 p-2 mr-3">
                          <GraduationCap size={16} className="text-green-600" />
                        </div>
                      ) : resource.type === "tutorial" ? (
                        <div className="rounded-full bg-blue-100 p-2 mr-3">
                          <BookOpen size={16} className="text-blue-600" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-purple-100 p-2 mr-3">
                          <FileText size={16} className="text-purple-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{resource.title}</p>
                        <p className="text-xs text-gray-500">{resource.course}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                Browse All Resources
              </button>
            </div>
          </div>

          {/* Study Groups */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <h2 className="font-bold text-gray-800">My Study Groups</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-100 p-2 mr-3">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Database Study Group</p>
                        <p className="text-xs text-gray-500">5 members • CS305</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="rounded-full bg-green-100 p-2 mr-3">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Programming Partners</p>
                        <p className="text-xs text-gray-500">3 members • CS101</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="rounded-full bg-purple-100 p-2 mr-3">
                        <Users size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">ML Project Team</p>
                        <p className="text-xs text-gray-500">4 members • CS450</p>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Upcoming</span>
                  </div>
                </div>
              </div>
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                Find Study Groups
              </button>
            </div>
          </div>

          {/* Academic Goals */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <h2 className="font-bold text-gray-800">Academic Goals</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Semester GPA Target: 3.7</span>
                  <span className="text-gray-500">Current: {gpa}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(gpa / 3.7) * 100 > 100 ? 100 : (gpa / 3.7) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Assignment Completion</span>
                  <span className="text-gray-500">{completedAssignments}/{totalAssignments}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Study Hours Goal: 20hrs/week</span>
                  <span className="text-gray-500">Current: 12hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg bg-yellow-50">
                <div className="flex items-start">
                  <Star size={16} className="text-yellow-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Weekly Goal</p>
                    <p className="text-xs text-gray-600 mt-1">Complete all programming assignments and increase study hours to 15hrs this week</p>
                  </div>
                </div>
              </div>
              
              <button className="mt-4 text-blue-500 text-sm w-full text-center">
                Set New Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentDashboard;