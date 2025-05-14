import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  BarChart2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  PlusCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function FacultySidebar({ collapsed, setCollapsed }) {
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

  const navigationItems = [
    { name: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
    {
      name: 'Course Management',
      category: true,
      items: [
        { name: 'All Courses', href: '/faculty/courses', icon: BookOpen },
        { name: 'Pending Approval', href: '/faculty/courses/pending', icon: Clock },
        { name: 'Approved Courses', href: '/faculty/courses/active', icon: CheckCircle },
        { name: 'Inactive Courses', href: '/faculty/courses/inactive', icon: Clock }
      ]
    },
    {
      name: 'Quiz Management',
      category: true,
      items: [
        { name: 'All Quizzes', href: '/faculty/quizzes', icon: FileText },
        { name: 'Create Quiz', href: '/faculty/quizzes/new', icon: PlusCircle }
      ]
    },
    { name: 'Calendar', href: '/faculty/calendar', icon: Calendar },
    { name: 'Reports', href: '/faculty/reports', icon: BarChart2 },
    { name: 'Settings', href: '/faculty/settings', icon: Settings },
    { name: 'Help & Support', href: '/faculty/help', icon: HelpCircle }
  ];

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
              <Link to="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Faculty Portal</span>
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
              </Link>
            )
          ))}
        </nav>

        {/* Sidebar footer */}
        {!collapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Faculty Portal</p>
                <p className="text-xs text-gray-400">&copy; 2025 University</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
