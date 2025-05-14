import { useState, useEffect } from 'react';
import StudentNavbar from './Navbar';
import StudentSidebar from './Sidebar';

const StudentDashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if viewport is mobile on mount and collapse sidebar automatically
  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    // Check initially
    checkIfMobile();
    
    // No need to add event listener here as Sidebar component already handles this
  }, []);

  return (
    <div className="flex h-screen">
      <StudentSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <StudentNavbar />
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;