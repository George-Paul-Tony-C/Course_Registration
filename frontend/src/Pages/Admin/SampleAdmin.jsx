import React, { useContext, useState } from 'react';
import { Users, BookOpen, Award, BarChart, Settings, Bell, Search, Menu, X, Trash } from 'lucide-react';
import { AuthCtx } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function SampleAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const { logout } = useContext(AuthCtx);
  const handleLogout = async () => {
    await logout();
  }
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">LMS Admin</h2>}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-indigo-700">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-6">
          <div 
            className={`flex items-center p-4 ${activeTab === 'overview' ? 'bg-indigo-900' : 'hover:bg-indigo-700'} cursor-pointer`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart size={20} />
            {sidebarOpen && <span className="ml-4">Overview</span>}
          </div>
          
          <div 
            className={`flex items-center p-4 ${activeTab === 'users' ? 'bg-indigo-900' : 'hover:bg-indigo-700'} cursor-pointer`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-4">User Management</span>}
          </div>
          
          <div 
            className={`flex items-center p-4 ${activeTab === 'courses' ? 'bg-indigo-900' : 'hover:bg-indigo-700'} cursor-pointer`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={20} />
            {sidebarOpen && <span className="ml-4">Courses</span>}
          </div>
          
          <div 
            className={`flex items-center p-4 ${activeTab === 'certificates' ? 'bg-indigo-900' : 'hover:bg-indigo-700'} cursor-pointer`}
            onClick={() => setActiveTab('certificates')}
          >
            <Award size={20} />
            {sidebarOpen && <span className="ml-4">Certificates</span>}
          </div>
          
          <div 
            className={`flex items-center p-4 ${activeTab === 'settings' ? 'bg-indigo-900' : 'hover:bg-indigo-700'} cursor-pointer`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-4">Settings</span>}
          </div>
          <div 
            className={`flex items-center p-4 bg-red-700 top-75 relative cursor-pointer`}
            onClick={() => handleLogout()}
          >
            <Trash size={20} />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center w-1/2">
              <div className="relative w-full max-w-xl">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-indigo-600">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to='/admin/profile' className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  AD
                </div>
                <span className="font-medium">Admin User</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-3xl font-bold">352</p>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users size={24} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-gray-500 text-sm font-medium">Active Courses</h2>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-3xl font-bold">47</p>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-blue-600 text-sm mt-2">↑ 5% from last month</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-gray-500 text-sm font-medium">Enrolled Students</h2>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-3xl font-bold">230</p>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Users size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-purple-600 text-sm mt-2">↑ 8% from last month</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-gray-500 text-sm font-medium">Certificates Issued</h2>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-3xl font-bold">152</p>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Award size={24} className="text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-yellow-600 text-sm mt-2">↑ 15% from last month</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">Recent User Registrations</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">John Smith</p>
                                <p className="text-xs text-gray-500">john@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Student</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Apr 25, 2025</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">Sarah Johnson</p>
                                <p className="text-xs text-gray-500">sarah@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Faculty</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Apr 24, 2025</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">Michael Brown</p>
                                <p className="text-xs text-gray-500">michael@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Student</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Apr 23, 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">Popular Courses</h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Web Development Fundamentals</h3>
                          <p className="text-sm text-gray-500">Faculty: Prof. Jennifer Lee</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">78 Students</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Enrollment Rate</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Data Science Essentials</h3>
                          <p className="text-sm text-gray-500">Faculty: Dr. Robert Chen</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">65 Students</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Enrollment Rate</span>
                          <span>72%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Mobile App Development</h3>
                          <p className="text-sm text-gray-500">Faculty: Prof. David Kim</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">54 Students</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Enrollment Rate</span>
                          <span>68%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '68%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Add New User
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex space-x-4">
                    <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>All Roles</option>
                      <option>Student</option>
                      <option>Faculty</option>
                      <option>Admin</option>
                    </select>
                    <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  </div>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">John Smith</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">john@example.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Student</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">sarah@example.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Faculty</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Michael Brown</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">michael@example.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Student</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="px-6 py-4 flex items-center justify-between border-t">
                  <div className="text-sm text-gray-500">
                    Showing 1 to 3 of 352 results
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm">Previous</button>
                    <button className="px-3 py-1 border bg-indigo-600 text-white rounded-md text-sm">1</button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm">2</button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm">3</button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Course Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Create New Course
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-indigo-200"></div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium">Web Development Fundamentals</h2>
                    <p className="text-sm text-gray-500 mt-1">Faculty: Prof. Jennifer Lee</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">78 Students</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Manage</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-blue-200"></div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium">Data Science Essentials</h2>
                    <p className="text-sm text-gray-500 mt-1">Faculty: Dr. Robert Chen</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">65 Students</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Manage</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-green-200"></div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium">Mobile App Development</h2>
                    <p className="text-sm text-gray-500 mt-1">Faculty: Prof. David Kim</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">54 Students</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Manage</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-purple-200"></div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium">UI/UX Design Principles</h2>
                    <p className="text-sm text-gray-500 mt-1">Faculty: Prof. Emily Wong</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">42 Students</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Manage</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-yellow-200"></div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium">Advanced Python Programming</h2>
                    <p className="text-sm text-gray-500 mt-1">Faculty: Dr. Amanda Rodriguez</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">38 Students</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Manage</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-red-200"></div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium">Network Security Fundamentals</h2>
                    <p className="text-sm text-gray-500 mt-1">Faculty: Prof. Thomas Wilson</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">27 Students</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}