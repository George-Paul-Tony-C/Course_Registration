import { useState, useEffect } from 'react';
import FacultyNavbar from './Navbar';
import FacultySidebar from './Sidebar';

const FacultyDashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkIfMobile();
  }, []);

  return (
    <div className="flex h-screen">
      <FacultySidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <FacultyNavbar />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboardLayout;
