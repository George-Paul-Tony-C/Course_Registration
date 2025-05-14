import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Award,
  PenTool,
  Users,
  Clock,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Bookmark
} from 'lucide-react';

export default function StudentSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [setCollapsed]);

  // Navigation items specifically tailored for students
  const navigationItems = [
    { name: 'Dashboard', href: '/student', icon: GraduationCap },
    {
      name: 'Academics',
      category: true,
      items: [
        { name: 'My Courses', href: '/student/courses', icon: BookOpen },
        { name: 'Schedule', href: '/student/schedule', icon: Calendar },
        { name: 'Assignments', href: '/student/assignments', icon: FileText },
        { name: 'Grades', href: '/student/grades', icon: Award },
        { name: 'Exams', href: '/student/exams', icon: PenTool }
      ]
    },
    {
      name: 'Resources',
      category: true,
      items: [
        { name: 'Library', href: '/student/library', icon: Bookmark },
        { name: 'Study Groups', href: '/student/study-groups', icon: Users },
        { name: 'Tutoring', href: '/student/tutoring', icon: Users }
      ]
    },
    { name: 'Deadlines', href: '/student/deadlines', icon: Clock, badge: '2' },
    { name: 'Messages', href: '/student/messages', icon: MessageSquare, badge: '5' },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Payments', href: '/student/payments', icon: CreditCard },
    { name: 'Profile', href: '/student/profile', icon: User },
    { name: 'Settings', href: '/student/settings', icon: Settings },
    { name: 'Help & Support', href: '/student/help', icon: HelpCircle }
  ];

  // Check if nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-full flex-col border-r border-gray-200 bg-white">
        {/* Sidebar header with logo when expanded */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <div className="flex flex-shrink-0 items-center">
              <Link to="/student" className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Student Portal</span>
              </Link>
            </div>
          )}
          
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigationItems.map((item, index) => (
            item.category ? (
              <div key={`category-${index}`} className={`space-y-1 ${collapsed ? 'mt-4' : 'mt-2'}`}>
                {!collapsed && (
                  <p className="px-2 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {item.name}
                  </p>
                )}
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive(subItem.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <subItem.icon 
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive(subItem.href) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-500'
                      }`} 
                    />
                    {!collapsed && <span className="ml-3">{subItem.name}</span>}
                    {!collapsed && subItem.badge && (
                      <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {subItem.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon 
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive(item.href) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-500'
                  }`} 
                />
                {!collapsed && <span className="ml-3">{item.name}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          ))}
        </nav>
        
        {/* Sidebar footer */}
        {!collapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Student Portal v1.0</p>
                <p className="text-xs text-gray-400">&copy; 2025 University</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}