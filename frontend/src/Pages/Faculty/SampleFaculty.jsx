import React, { useContext, useState } from 'react';
import { BookOpen, Users, FileText, CheckSquare, Video, FileUp, Home, LogOut, Mail, Settings, Bell, X, Edit, Trash, Play, Eye } from 'lucide-react';
import { AuthCtx } from '../../context/AuthContext';

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { logout } = useContext(AuthCtx);

    const handleLogout = async () => {
      await logout();
    }
  
  const courses = [
    { id: 1, title: "Web Development Fundamentals", students: 78, progress: 65 },
    { id: 2, title: "Advanced JavaScript", students: 42, progress: 40 },
    { id: 3, title: "Responsive Design Techniques", students: 35, progress: 80 }
  ];
  
  const studentsList = [
    { id: 1, name: "John Smith", email: "john.smith@example.com", course: "Web Development Fundamentals", progress: 75, lastActive: "Today, 10:30 AM" },
    { id: 2, name: "Lisa Brown", email: "lisa.brown@example.com", course: "Web Development Fundamentals", progress: 82, lastActive: "Yesterday, 3:45 PM" },
    { id: 3, name: "Mike Johnson", email: "mike.j@example.com", course: "Advanced JavaScript", progress: 45, lastActive: "Apr 24, 2025" },
    { id: 4, name: "Sarah Davis", email: "sarah.d@example.com", course: "Advanced JavaScript", progress: 60, lastActive: "Apr 23, 2025" },
    { id: 5, name: "Alex Turner", email: "alex.t@example.com", course: "Responsive Design Techniques", progress: 90, lastActive: "Today, 9:15 AM" },
    { id: 6, name: "Emma Wilson", email: "emma.w@example.com", course: "Web Development Fundamentals", progress: 30, lastActive: "Apr 20, 2025" }
  ];
  
  const filteredStudents = searchTerm 
    ? studentsList.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : studentsList;
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-teal-800 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">LMS Faculty</h2>
          <div className="flex items-center mt-6">
            <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold">
              JL
            </div>
            <div className="ml-3">
              <p className="font-medium">Jennifer Lee</p>
              <p className="text-teal-300 text-sm">Web Development</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-8">
          <a 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-6 py-3 text-teal-100 ${activeTab === 'dashboard' ? 'bg-teal-900' : 'hover:bg-teal-700'} cursor-pointer`}
          >
            <Home size={20} />
            <span className="ml-3">Dashboard</span>
          </a>
          
          <a 
            onClick={() => setActiveTab('courses')}
            className={`flex items-center px-6 py-3 text-teal-100 ${activeTab === 'courses' ? 'bg-teal-900' : 'hover:bg-teal-700'} cursor-pointer`}
          >
            <BookOpen size={20} />
            <span className="ml-3">My Courses</span>
          </a>
          
          <a 
            onClick={() => setActiveTab('students')}
            className={`flex items-center px-6 py-3 text-teal-100 ${activeTab === 'students' ? 'bg-teal-900' : 'hover:bg-teal-700'} cursor-pointer`}
          >
            <Users size={20} />
            <span className="ml-3">Students</span>
          </a>
          
          <a 
            onClick={() => setActiveTab('content')}
            className={`flex items-center px-6 py-3 text-teal-100 ${activeTab === 'content' ? 'bg-teal-900' : 'hover:bg-teal-700'} cursor-pointer`}
          >
            <FileText size={20} />
            <span className="ml-3">Content</span>
          </a>
          
          <a 
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center px-6 py-3 text-teal-100 ${activeTab === 'quizzes' ? 'bg-teal-900' : 'hover:bg-teal-700'} cursor-pointer`}
          >
            <CheckSquare size={20} />
            <span className="ml-3">Quizzes</span>
          </a>
          
          <div className="px-6 py-6">
            <div className="border-t border-teal-700"></div>
          </div>
          
          <a 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center px-6 py-3 text-teal-100 ${activeTab === 'settings' ? 'bg-teal-900' : 'hover:bg-teal-700'} cursor-pointer`}
          >
            <Settings size={20} />
            <span className="ml-3">Settings</span>
          </a>
          
          <button className="flex items-center px-6 py-3 text-teal-100 hover:bg-teal-700 cursor-pointer"
            onClick={() => handleLogout()}
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'courses' && 'My Courses'}
              {activeTab === 'students' && 'Students'}
              {activeTab === 'content' && 'Course Content'}
              {activeTab === 'quizzes' && 'Quizzes'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-teal-600">
                <Bell size={20} />
              </button>
              <button className="text-gray-600 hover:text-teal-600">
                <Mail size={20} />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                  JL
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-teal-100 text-teal-600">
                      <BookOpen size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
                      <p className="text-2xl font-semibold">3</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Users size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                      <p className="text-2xl font-semibold">155</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <CheckSquare size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Pending Quizzes</h3>
                      <p className="text-2xl font-semibold">24</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Course Progress</h3>
                  </div>
                  <div className="p-6">
                    {courses.map(course => (
                      <div key={course.id} className="mb-4 last:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{course.title}</h4>
                          <span className="text-xs text-gray-500">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Recent Activities</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <FileUp size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">New assignment uploaded</p>
                          <p className="text-xs text-gray-500">Web Development Fundamentals • 2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <CheckSquare size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">Quiz graded</p>
                          <p className="text-xs text-gray-500">Advanced JavaScript • 4 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                          <Users size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">New student enrolled</p>
                          <p className="text-xs text-gray-500">Responsive Design Techniques • 1 day ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                          <Video size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">New video content added</p>
                          <p className="text-xs text-gray-500">Web Development Fundamentals • 2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Recent Messages</h3>
                </div>
                <div className="divide-y">
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-medium">
                          JS
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">John Smith</h4>
                          <span className="ml-2 text-xs text-gray-500">Today, 10:30 AM</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Question about the latest assignment deadline...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-600 font-medium">
                          AD
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">Admin</h4>
                          <span className="ml-2 text-xs text-gray-500">Yesterday, 4:15 PM</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">New course materials guidelines have been published...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-medium">
                          LB
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">Lisa Brown</h4>
                          <span className="ml-2 text-xs text-gray-500">Apr 22, 2025</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">I've submitted my project for review, looking forward to your feedback!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">My Courses</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your courses and course materials</p>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  Course Request
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                      <BookOpen size={48} className="text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{course.title}</h3>
                      <div className="flex items-center mt-2">
                        <Users size={16} className="text-gray-500" />
                        <span className="ml-1 text-sm text-gray-500">{course.students} Students</span>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Course Progress</span>
                          <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <button 
                          onClick={() => setSelectedCourse(course)}
                          className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200"
                        >
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          Students
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCourse && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
                    <div className="p-6 border-b flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{selectedCourse.title}</h3>
                      <button 
                        onClick={() => setSelectedCourse(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <div className="flex items-center">
                            <Users size={20} className="text-teal-600" />
                            <span className="ml-2 text-gray-800 font-medium">{selectedCourse.students} Students</span>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={20} className="text-teal-600" />
                            <span className="ml-2 text-gray-800 font-medium">12 Modules</span>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <div className="flex items-center">
                            <CheckSquare size={20} className="text-teal-600" />
                            <span className="ml-2 text-gray-800 font-medium">8 Quizzes</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Course Description</h4>
                        <p className="text-gray-600">This comprehensive course covers the fundamentals of web development including HTML, CSS, and JavaScript. Students will learn how to create responsive, interactive websites from scratch.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Course Content</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={16} className="text-teal-600" />
                              <span className="ml-2">Introduction to HTML</span>
                            </div>
                            <button className="text-teal-600 hover:text-teal-800">Edit</button>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={16} className="text-teal-600" />
                              <span className="ml-2">CSS Basics</span>
                            </div>
                            <button className="text-teal-600 hover:text-teal-800">Edit</button>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <Video size={16} className="text-teal-600" />
                              <span className="ml-2">JavaScript Fundamentals</span>
                            </div>
                            <button className="text-teal-600 hover:text-teal-800">Edit</button>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckSquare size={16} className="text-teal-600" />
                              <span className="ml-2">Week 1 Quiz</span>
                            </div>
                            <button className="text-teal-600 hover:text-teal-800">Edit</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                          Add Content
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <p className="text-sm text-gray-500 mt-1">Upload and manage your course materials</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center">
                    <CheckSquare size={18} className="mr-2" />
                    Add Quiz
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center">
                    <FileUp size={18} className="mr-2" />
                    Upload Content
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Web Development Fundamentals</option>
                      <option>Advanced JavaScript</option>
                      <option>Responsive Design Techniques</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
                        Module View
                      </button>
                      <button className="px-3 py-1 border bg-teal-100 text-teal-700 rounded-md">
                        List View
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Module 1: Introduction to Web Development</h3>
                      <button className="text-teal-600 hover:text-teal-800 flex items-center">
                        <FileUp size={16} className="mr-1" />
                        Add Content
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText size={18} className="text-gray-500" />
                          <div className="ml-3">
                            <h4 className="text-md font-medium">Introduction to HTML</h4>
                            <p className="text-sm text-gray-500">PDF • 2.4 MB • Uploaded on Apr 20, 2025</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <FileText size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50">
                        <div className="flex items-center">
                          <Video size={18} className="text-gray-500" />
                          <div className="ml-3">
                            <h4 className="text-md font-medium">HTML Tags Overview</h4>
                            <p className="text-sm text-gray-500">Video • 45 min • Uploaded on Apr 21, 2025</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Play size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50">
                        <div className="flex items-center">
                          <CheckSquare size={18} className="text-gray-500" />
                          <div className="ml-3">
                            <h4 className="text-md font-medium">HTML Basics Quiz</h4>
                            <p className="text-sm text-gray-500">Quiz • 10 questions • Due on Apr 28, 2025</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Eye size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Module 2: CSS Styling</h3>
                      <button className="text-teal-600 hover:text-teal-800 flex items-center">
                        <FileUp size={16} className="mr-1" />
                        Add Content
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText size={18} className="text-gray-500" />
                          <div className="ml-3">
                            <h4 className="text-md font-medium">CSS Fundamentals</h4>
                            <p className="text-sm text-gray-500">PDF • 3.1 MB • Uploaded on Apr 22, 2025</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <FileText size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <FileText size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50">
                        <div className="flex items-center">
                          <Video size={18} className="text-gray-500" />
                          <div className="ml-3">
                            <h4 className="text-md font-medium">CSS Selectors Explained</h4>
                            <p className="text-sm text-gray-500">Video • 32 min • Uploaded on Apr 23, 2025</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Play size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'students' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Student Management</h2>
                  <p className="text-sm text-gray-500 mt-1">Monitor student progress and performance</p>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  Export Report
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full border rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Search students..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="">All Courses</option>
                        <option value="web-dev">Web Development Fundamentals</option>
                        <option value="js">Advanced JavaScript</option>
                        <option value="responsive">Responsive Design Techniques</option>
                      </select>
                      <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="">Sort By</option>
                        <option value="name">Name</option>
                        <option value="progress">Progress</option>
                        <option value="last-active">Last Active</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.course}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{student.progress}%</span>
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    student.progress >= 70 ? 'bg-green-500' : 
                                    student.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-teal-600 hover:text-teal-900 mr-3">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Message</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{studentsList.length}</span> students
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-gray-500">Previous</button>
                    <button className="px-3 py-1 bg-teal-100 text-teal-700 border border-teal-300 rounded-md">1</button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-gray-500">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'quizzes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Quizzes & Assessments</h2>
                  <p className="text-sm text-gray-500 mt-1">Create and manage quizzes and assessments</p>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center">
                  <CheckSquare size={18} className="mr-2" />
                  Create New Quiz
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-medium">HTML Basics Quiz</h3>
                    <p className="text-sm text-gray-500 mt-1">Web Development Fundamentals</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckSquare size={18} className="text-teal-600" />
                        <span className="ml-2 text-gray-600">10 Questions</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: Apr 28, 2025
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Users size={18} className="text-teal-600" />
                        <span className="ml-2 text-gray-600">78 Students</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        42 Completed
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200">
                        Edit Quiz
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        View Results
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-medium">JavaScript Functions Quiz</h3>
                    <p className="text-sm text-gray-500 mt-1">Advanced JavaScript</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckSquare size={18} className="text-teal-600" />
                        <span className="ml-2 text-gray-600">15 Questions</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: May 2, 2025
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Users size={18} className="text-teal-600" />
                        <span className="ml-2 text-gray-600">42 Students</span>
                      </div>
                      <div className="text-sm font-medium text-yellow-600">
                        18 Completed
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200">
                        Edit Quiz
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        View Results
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-medium">Flexbox & Grid Assessment</h3>
                    <p className="text-sm text-gray-500 mt-1">Responsive Design Techniques</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckSquare size={18} className="text-teal-600" />
                        <span className="ml-2 text-gray-600">5 Questions</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: May 5, 2025
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Users size={18} className="text-teal-600" />
                        <span className="ml-2 text-gray-600">35 Students</span>
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        8 Completed
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200">
                        Edit Quiz
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        View Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Recent Quiz Submissions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              JS
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">John Smith</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">HTML Basics Quiz</div>
                          <div className="text-xs text-gray-500">Web Development Fundamentals</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            85%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Today, 10:30 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-900">Review</button>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                              LB
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Lisa Brown</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">HTML Basics Quiz</div>
                          <div className="text-xs text-gray-500">Web Development Fundamentals</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            92%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Today, 9:15 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-900">Review</button>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-medium">
                              MJ
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Mike Johnson</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">JavaScript Functions Quiz</div>
                          <div className="text-xs text-gray-500">Advanced JavaScript</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            68%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Yesterday, 5:45 PM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-900">Review</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t">
                  <button className="text-teal-600 hover:text-teal-800 font-medium">
                    View All Submissions
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (<div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
                    </div>
                </div>
              
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium">Profile Information</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                            <div className="mb-4 md:mb-0 md:mr-6">
                                <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                                    JL
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input 
                                        type="text" 
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                        defaultValue="Jennifer Lee"
                                    />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                            defaultValue="jennifer.lee@example.com"
                                        />
                                    </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input 
                                        type="text" 
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                        defaultValue="Computer Science"
                                    />
                                    </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                        defaultValue="Associate Professor"
                                    />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea 
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    rows="4"
                                    defaultValue="Web development instructor with over 10 years of professional experience. Specializing in frontend technologies and responsive design."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
              
                <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium">Notification Settings</h3>
                    </div>
                    <div className="p-6 divide-y">
                        <div className="py-4 flex items-center justify-between">
                            <div>
                            <h4 className="text-md font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-500 mt-1">Receive notifications via email</p>
                            </div>
                            <div className="flex items-center">
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input type="checkbox" id="email-toggle" defaultChecked className="sr-only" />
                                <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                            </div>
                            </div>
                        </div>
                    
                        <div className="py-4 flex items-center justify-between">
                            <div>
                                <h4 className="text-md font-medium">Student Submissions</h4>
                                <p className="text-sm text-gray-500 mt-1">Get notified when students submit assignments</p>
                            </div>
                            <div className="flex items-center">
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input type="checkbox" id="submissions-toggle" defaultChecked className="sr-only" />
                                <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                            </div>
                        </div>
                    </div>
                  
                    <div className="py-4 flex items-center justify-between">
                        <div>
                        <h4 className="text-md font-medium">Messages</h4>
                        <p className="text-sm text-gray-500 mt-1">Get notified when you receive messages</p>
                        </div>
                        <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="messages-toggle" defaultChecked className="sr-only" />
                            <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                        </div>
                    </div>
                  
                    <div className="py-4 flex items-center justify-between">
                        <div>
                        <h4 className="text-md font-medium">Course Updates</h4>
                        <p className="text-sm text-gray-500 mt-1">Get notified about system and course updates</p>
                        </div>
                        <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="updates-toggle" className="sr-only" />
                            <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t">
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Save Preferences
                  </button>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Security</h3>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <h4 className="text-md font-medium mb-4">Change Password</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input 
                                type="password" 
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input 
                                type="password" 
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                                Update Password
                            </button>
                        </div>
                    </div>
            
                    <div className="mt-8 border-t pt-6">
                        <h4 className="text-md font-medium mb-4">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Enable two-factor authentication for enhanced security</p>
                                <p className="text-xs text-gray-500 mt-1">You'll be asked for a security code in addition to your password when signing in</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>)}
            </main>
        </div>
    </div>
    );
}