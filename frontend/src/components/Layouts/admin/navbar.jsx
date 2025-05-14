import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthCtx } from '../../../context/AuthContext';
import { 
  Menu,
  X, 
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  FileText,
  BarChart2,
  HelpCircle,
  Shield,
  Moon,
  Sun
} from 'lucide-react';

export default function Navbar() {
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
    // You would implement actual dark mode toggling here
    // document.documentElement.classList.toggle('dark');
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Navigation items
  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Faculties', href: '/admin/faculties', icon: Users },
    { name: 'Managing', href: '/admin/managing', icon: Calendar },
    { name: 'Reports', href: '/admin/reports', icon: BarChart2 }
  ];

  // Check if nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New student enrollment', time: '5 minutes ago', read: false },
    { id: 2, text: 'Course approval request', time: '1 hour ago', read: false },
    { id: 3, text: 'Semester registration opens tomorrow', time: '3 hours ago', read: true }
  ];

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-start">
          {/* Logo and mobile menu button */}
          <div className="flex">      
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:border-b-2 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="mr-1.5 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Search */}
          <div className="hidden flex-1 items-center justify-center px-2 lg:ml-6 lg:flex lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search courses, students..."
                  type="search"
                />
              </form>
            </div>
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
                {notifications.some(n => !n.read) && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.filter(n => !n.read).length}
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
                    <Link to="/admin/notifications" className="block text-center text-xs font-medium text-blue-600 hover:text-blue-500">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative ml-3" ref={profileMenuRef}>
              <div>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center rounded-full border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="ml-2 hidden text-gray-700 lg:block">{user?.username || 'Admin'}</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>
              </div>
              {profileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-sm font-medium text-gray-800">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Your Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                  <Link
                    to="/admin/help"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-gray-200 px-2 pb-3 pt-2">
            {/* Mobile search */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="mobile-search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search courses, students..."
                  type="search"
                />
              </form>
            </div>
            
            {/* Mobile navigation */}
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}