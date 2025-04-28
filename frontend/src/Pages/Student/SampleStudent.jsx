import React, { useState, useEffect, useContext } from 'react';
import { Bell, Book, Calendar, CheckCircle, FileText, Home, LogOut, Play, User } from 'lucide-react';
import { AuthCtx } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { logout } = useContext(AuthCtx);
    const handleLogout = async () => {
      await logout();
    }
  
  // Mock data - would be fetched from API
  useEffect(() => {
    // Fetch student profile
    setProfile({
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      enrolledCourses: 4,
      completedCourses: 2,
      profilePic: "/api/placeholder/80/80"
    });
    
    // Fetch courses
    setCourses([
      {
        id: 1,
        title: "Introduction to Web Development",
        instructor: "Dr. Sarah Miller",
        progress: 85,
        nextLesson: "CSS Frameworks",
        dueDate: "May 3, 2025",
        thumbnail: "/api/placeholder/300/160",
        status: "in-progress"
      },
      {
        id: 2,
        title: "Data Structures and Algorithms",
        instructor: "Prof. Michael Chen",
        progress: 100,
        completionDate: "April 15, 2025",
        certificateAvailable: true,
        thumbnail: "/api/placeholder/300/160",
        status: "completed"
      },
      {
        id: 3,
        title: "Machine Learning Fundamentals",
        instructor: "Dr. Lisa Wong",
        progress: 42,
        nextLesson: "Decision Trees",
        dueDate: "May 10, 2025",
        thumbnail: "/api/placeholder/300/160",
        status: "in-progress"
      },
      {
        id: 4,
        title: "Database Management Systems",
        instructor: "Prof. Robert Garcia",
        progress: 0,
        status: "not-started",
        startDate: "May 5, 2025",
        thumbnail: "/api/placeholder/300/160"
      }
    ]);
    
    // Fetch notifications
    setNotifications([
      {
        id: 1,
        type: "assignment",
        message: "New assignment: 'CSS Grid Layout' due on May 1",
        course: "Introduction to Web Development",
        time: "1 hour ago",
        isRead: false
      },
      {
        id: 2,
        type: "announcement",
        message: "Course materials updated for 'Linear Regression'",
        course: "Machine Learning Fundamentals",
        time: "Yesterday",
        isRead: false
      },
      {
        id: 3,
        type: "certificate",
        message: "Certificate available for 'Data Structures and Algorithms'",
        course: "Data Structures and Algorithms",
        time: "2 days ago",
        isRead: true
      }
    ]);
  }, []);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-1">Welcome back, {profile.name}!</h2>
        <p className="text-gray-600">Continue where you left off or explore your course catalog.</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Enrolled Courses</p>
              <h3 className="text-2xl font-bold">{profile.enrolledCourses}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Book className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Completed Courses</p>
              <h3 className="text-2xl font-bold">{profile.completedCourses}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Upcoming Due Dates</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Calendar className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* In Progress Courses */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.filter(course => course.status === 'in-progress').map(course => (
            <div key={course.id} className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCourseClick(course)}>
              <div className="relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-white font-medium">{course.title}</h3>
                  <p className="text-white/80 text-sm">{course.instructor}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next: {course.nextLesson}</span>
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                    <Play size={16} /> Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Notifications */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
        <div className="space-y-3">
          {notifications.slice(0, 3).map(notification => (
            <div key={notification.id} className={`p-3 border rounded-lg flex items-start gap-3 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}>
              <div className={`p-2 rounded-full ${
                notification.type === 'assignment' ? 'bg-amber-100' : 
                notification.type === 'announcement' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {notification.type === 'assignment' ? <FileText size={18} className="text-amber-600" /> : 
                 notification.type === 'announcement' ? <Bell size={18} className="text-blue-600" /> : 
                 <CheckCircle size={18} className="text-green-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{notification.course}</span>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
          {notifications.length > 3 && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium" onClick={() => setActiveTab('notifications')}>
              View all notifications
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyCourses = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        
        {/* Course Filter */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-white shadow">All Courses</button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200">In Progress</button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200">Completed</button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200">Not Started</button>
        </div>
        
        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCourseClick(course)}>
              <div className="relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2">
                  {course.status === 'completed' && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Completed</span>
                  )}
                  {course.status === 'in-progress' && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">In Progress</span>
                  )}
                  {course.status === 'not-started' && (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Not Started</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{course.instructor}</p>
                
                {course.status === 'in-progress' && (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </>
                )}
                
                {course.status === 'completed' && course.certificateAvailable && (
                  <button className="mt-2 w-full py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                    View Certificate
                  </button>
                )}
                
                {course.status === 'not-started' && (
                  <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Start Course
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">Mark all as read</button>
        </div>
        
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-4 border rounded-lg flex items-start gap-3 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}>
              <div className={`p-2 rounded-full ${
                notification.type === 'assignment' ? 'bg-amber-100' : 
                notification.type === 'announcement' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {notification.type === 'assignment' ? <FileText size={20} className="text-amber-600" /> : 
                 notification.type === 'announcement' ? <Bell size={20} className="text-blue-600" /> : 
                 <CheckCircle size={20} className="text-green-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">{notification.course}</span>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-6">My Profile</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <img src={profile.profilePic} alt="Profile" className="rounded-full w-32 h-32 object-cover" />
            <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
              Change Photo
            </button>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                  value={profile.name} 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                  value={profile.email} 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                  value="••••••••" 
                  readOnly 
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievement Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">My Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium">Data Structures and Algorithms</h3>
                <p className="text-sm text-gray-600">Completed on April 15, 2025</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                View Certificate
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center h-full text-center p-6">
              <p className="text-gray-500">Complete more courses to earn certificates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CourseModal = ({ course, onClose }) => {
    const [activeTab, setActiveTab] = useState('content');
    
    if (!course) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-auto">
          <div className="relative">
            <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/80 rounded-full p-1 hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-1">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.instructor}</p>
            
            {course.status === 'in-progress' && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Your Progress</span>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            )}
            
            <div className="border-b mb-6">
              <div className="flex space-x-4">
                <button 
                  className={`pb-2 px-1 ${activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('content')}
                >
                  Course Content
                </button>
                <button 
                  className={`pb-2 px-1 ${activeTab === 'quizzes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('quizzes')}
                >
                  Quizzes & Assignments
                </button>
                <button 
                  className={`pb-2 px-1 ${activeTab === 'discussion' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  Discussion
                </button>
              </div>
            </div>
            
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50 font-medium">
                    Module 1: Introduction
                  </div>
                  <div className="divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Play size={16} className="text-green-600" />
                        </div>
                        <span>Course Overview</span>
                      </div>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <span>Introduction Slides</span>
                      </div>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                          <FileText size={16} className="text-amber-600" />
                        </div>
                        <span>Module 1 Quiz</span>
                      </div>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50 font-medium">
                    Module 2: Fundamentals
                  </div>
                  <div className="divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Play size={16} className="text-green-600" />
                        </div>
                        <span>Basic Concepts</span>
                      </div>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <span>Reading Materials</span>
                      </div>
                      <span className="text-sm text-blue-600">In Progress</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                          <FileText size={16} className="text-amber-600" />
                        </div>
                        <span>Module 2 Assignment</span>
                      </div>
                      <span className="text-sm text-gray-500">Not Started</span>
                    </div>
                  </div>
                </div>
                
                {/* Continue with more modules... */}
              </div>
            )}
            
            {activeTab === 'quizzes' && (
              <div className="space-y-4">
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50 font-medium">
                    Quizzes
                  </div>
                  <div className="divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Module 1 Quiz</h3>
                        <p className="text-sm text-gray-500">10 questions • 15 min</p>
                      </div>
                      <span className="text-sm text-green-600">Completed (90%)</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Module 2 Quiz</h3>
                        <p className="text-sm text-gray-500">15 questions • 20 min</p>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Start Quiz</button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50 font-medium">
                    Assignments
                  </div>
                  <div className="divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Module 1 Assignment</h3>
                        <p className="text-sm text-gray-500">Due: April 20, 2025</p>
                      </div>
                      <span className="text-sm text-green-600">Submitted</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Module 2 Assignment</h3>
                        <p className="text-sm text-gray-500">Due: May 3, 2025</p>
                      </div>
                      <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'discussion' && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Course Discussion</h3>
                  <p className="text-gray-600 mb-4">Connect with your instructor and peers to discuss course content, ask questions, and share insights.</p>
                  
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="flex gap-3">
                      <img src="/api/placeholder/40/40" alt="User" className="rounded-full w-10 h-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Emma Wilson</span>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="mt-1">Can someone explain the concept of hoisting in JavaScript? I'm struggling to understand it.</p>
                        <div className="mt-2 flex gap-4">
                          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Reply
                          </button>
                          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            3 likes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 mb-4 ml-8">
                    <div className="flex gap-3">
                      <img src="/api/placeholder/40/40" alt="Instructor" className="rounded-full w-10 h-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Dr. Sarah Miller</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Instructor</span>
                          <span className="text-sm text-gray-500">1 day ago</span>
                        </div>
                        <p className="mt-1">Great question, Emma! Hoisting is JavaScript's default behavior of moving declarations to the top of their scope. I'll cover this in detail in our next live session.</p>
                        <div className="mt-2 flex gap-4">
                          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Reply
                          </button>
                          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            5 likes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Post a Comment</h4>
                    <textarea 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-32"
                      placeholder="Share your thoughts or questions..."
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-6">Calendar & Upcoming Deadlines</h2>
        
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            <div className="text-sm font-medium text-gray-500">Sun</div>
            <div className="text-sm font-medium text-gray-500">Mon</div>
            <div className="text-sm font-medium text-gray-500">Tue</div>
            <div className="text-sm font-medium text-gray-500">Wed</div>
            <div className="text-sm font-medium text-gray-500">Thu</div>
            <div className="text-sm font-medium text-gray-500">Fri</div>
            <div className="text-sm font-medium text-gray-500">Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 26;
              const hasEvent = [3, 10, 15].includes(day);
              
              return (
                <div 
                  key={day}
                  className={`p-2 rounded-md text-center relative ${
                    isToday ? 'bg-blue-600 text-white' : 
                    hasEvent ? 'border border-blue-200' : 
                    'hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <span className="text-sm">{day}</span>
                  {hasEvent && !isToday && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <h3 className="font-medium mb-4">Upcoming Deadlines</h3>
        <div className="space-y-3">
          <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">CSS Grid Layout Assignment</h4>
                <p className="text-sm text-gray-600">Introduction to Web Development</p>
              </div>
              <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                Due May 1
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Module 2 Quiz</h4>
                <p className="text-sm text-gray-600">Machine Learning Fundamentals</p>
              </div>
              <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                Due May 10
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Final Project Proposal</h4>
                <p className="text-sm text-gray-600">Introduction to Web Development</p>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                Due May 20
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-6">My Certificates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
              <h3 className="text-lg font-medium mb-1">Certificate of Completion</h3>
              <p>Data Structures and Algorithms</p>
            </div>
            <div className="p-6 text-center">
              <p className="mb-4">Awarded to</p>
              <h3 className="text-xl font-semibold mb-1">{profile.name}</h3>
              <p className="text-gray-600 mb-6">April 15, 2025</p>
              
              <div className="flex justify-center gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg flex flex-col items-center justify-center p-8 bg-gray-50">
            <div className="text-center mb-4">
              <div className="p-4 bg-gray-200 rounded-full inline-block mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Complete More Courses</h3>
              <p className="text-gray-600 mt-1">Earn certificates by completing courses and demonstrating your knowledge</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseEnrollment = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-6">Course Enrollment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample Course Cards */}
          <div className="border rounded-lg overflow-hidden">
            <img src="/api/placeholder/300/160" alt="Python Programming" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-medium mb-1">Python Programming</h3>
              <p className="text-sm text-gray-600 mb-3">Prof. James Wilson</p>
              <p className="text-sm text-gray-600 mb-4">Learn Python programming from the ground up. Perfect for beginners.</p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Request Enrollment
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <img src="/api/placeholder/300/160" alt="Advanced JavaScript" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-medium mb-1">Advanced JavaScript</h3>
              <p className="text-sm text-gray-600 mb-3">Dr. Emily Parker</p>
              <p className="text-sm text-gray-600 mb-4">Take your JavaScript skills to the next level with advanced concepts.</p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Request Enrollment
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <img src="/api/placeholder/300/160" alt="UX Design Principles" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-medium mb-1">UX Design Principles</h3>
              <p className="text-sm text-gray-600 mb-3">Prof. Michelle Chang</p>
              <p className="text-sm text-gray-600 mb-4">Learn the fundamentals of user experience design and create intuitive interfaces.</p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Request Enrollment
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Pending Enrollment Requests</h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="divide-y">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Database Management Systems</h4>
                  <p className="text-sm text-gray-600">Prof. Robert Garcia</p>
                </div>
                <div className="text-sm text-amber-600">Pending Approval</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">EduLearn LMS</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <img src={profile.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="font-medium">{profile.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </button>
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'myCourses' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('myCourses')}
              >
                <Book size={20} />
                <span>My Courses</span>
              </button>
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('calendar')}
              >
                <Calendar size={20} />
                <span>Calendar</span>
              </button>
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={20} />
                <span>Notifications</span>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">{notifications.filter(n => !n.isRead).length}</span>
                )}
              </button>
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'certificates' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('certificates')}
              >
                <FileText size={20} />
                <span>Certificates</span>
              </button>
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'enrollment' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('enrollment')}
              >
                <Book size={20} />
                <span>Course Enrollment</span>
              </button>
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>My Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => handleLogout()}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'myCourses' && renderMyCourses()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'certificates' && renderCertificates()}
            {activeTab === 'enrollment' && renderCourseEnrollment()}
          </div>
        </div>
      </div>
      
      {showModal && <CourseModal course={selectedCourse} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default StudentDashboard;