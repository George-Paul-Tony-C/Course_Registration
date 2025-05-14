import { useState, useContext, useEffect, useRef } from 'react';
import { AuthCtx } from '../../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, User, LogOut, Bell, ChevronDown, LayoutDashboard, 
  BookOpen, Users, Calendar, BarChart2, Settings, Search, Sun, Moon 
} from 'lucide-react';

export default function FacultyNavbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthCtx);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle clicks outside of dropdown menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can implement actual dark mode logic here
    document.documentElement.classList.toggle('dark');
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Check if nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const notifications = [
    { id: 1, text: 'New student enrollment', time: '5 minutes ago', read: false },
    { id: 2, text: 'Course approval request', time: '1 hour ago', read: false },
    { id: 3, text: 'Semester registration opens tomorrow', time: '3 hours ago', read: true }
  ];

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex">
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-2">
              <Link
                to="/faculty"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/faculty')
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:border-b-2 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/faculty/courses"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/faculty/courses')
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:border-b-2 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <BookOpen className="mr-1.5 h-4 w-4" />
                Courses
              </Link>
              <Link
                to="/faculty/students"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/faculty/students')
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:border-b-2 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <Users className="mr-1.5 h-4 w-4" />
                Students
              </Link>
              <Link
                to="/faculty/reports"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/faculty/reports')
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:border-b-2 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <BarChart2 className="mr-1.5 h-4 w-4" />
                Reports
              </Link>
              <Link
                to="/faculty/settings"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/faculty/settings')
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:border-b-2 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <Settings className="mr-1.5 h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="hidden lg:flex lg:justify-end lg:w-full">
            <form onSubmit={handleSearch} className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search courses, students..."
                type="search"
              />
            </form>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications dropdown */}
            <div className="relative ml-3" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Bell className="h-5 w-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="border-b border-gray-200 pb-2 pt-1">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  <div className="mt-2 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-sm text-gray-500">No notifications</p>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start rounded-md p-2 ${
                              notification.read ? 'bg-white' : 'bg-blue-50'
                            } hover:bg-gray-50`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`h-8 w-8 rounded-full ${notification.read ? 'bg-gray-200' : 'bg-blue-200'} flex items-center justify-center`}>
                                <Bell className={`h-4 w-4 ${notification.read ? 'text-gray-600' : 'text-blue-600'}`} />
                              </div>
                            </div>
                            <div className="ml-3 w-full">
                              <p className="text-sm font-medium text-gray-800">{notification.text}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <Link to="/faculty/notifications" className="block text-center text-xs font-medium text-blue-600 hover:text-blue-500">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center rounded-full border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <span className="ml-2 hidden text-gray-700 lg:block">{user?.username || 'Faculty'}</span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-sm font-medium text-gray-800">{user?.username || 'Faculty'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'faculty@example.com'}</p>
                  </div>
                  <Link
                    to="/faculty/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Your Profile
                  </Link>
                  <Link
                    to="/faculty/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
