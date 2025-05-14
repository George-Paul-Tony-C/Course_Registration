import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  Mail,
  BookOpen,
  Edit,
  Trash,
  UserPlus,
  RefreshCw,
  Calendar,
  User
} from 'lucide-react';

import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';
import DashboardLayout from '../../components/Layouts/admin/dashboardLayout';

const FacultyListingPage = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [facultyCourseCount, setFacultyCourseCount] = useState({});

  useEffect(() => {
    fetchFaculty();
  }, [sortField, sortDirection, currentPage, pageSize, showDeleted]);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.ALL_FACULTY_USER, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          sort: `${sortField},${sortDirection}`,
          query: searchQuery || undefined,
          includeDeleted: showDeleted
        }
      });
      
      const facultyData = response.data.content || response.data;
      setFaculty(facultyData);
      setTotalFaculty(response.data.totalElements || response.data.length);
      
      // Fetch course counts for each faculty member
      if (facultyData.length > 0) {
        const courseCounts = {};
        await Promise.all(
          facultyData.map(async (instructor) => {
            try {
              const courseResponse = await axiosInstance.get(API_PATHS.FACULTY.ALL_COURSES(instructor.id));
              courseCounts[instructor.id] = courseResponse.data.length;
            } catch (err) {
              console.error(`Error fetching courses for faculty ${instructor.id}:`, err);
              courseCounts[instructor.id] = 0;
            }
          })
        );
        setFacultyCourseCount(courseCounts);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setError('Failed to load faculty members. Please try again later.');
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchFaculty();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleSelectAll = () => {
    if (selectedFaculty.length === faculty.length) {
      setSelectedFaculty([]);
    } else {
      setSelectedFaculty(faculty.map(instructor => instructor.id));
    }
  };

  const toggleSelectFaculty = (facultyId) => {
    if (selectedFaculty.includes(facultyId)) {
      setSelectedFaculty(selectedFaculty.filter(id => id !== facultyId));
    } else {
      setSelectedFaculty([...selectedFaculty, facultyId]);
    }
  };

  const handleActionMenu = (facultyId) => {
    if (actionMenuOpen === facultyId) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(facultyId);
    }
  };

  const handleAddFaculty = () => {
    navigate('/admin/faculty/new');
  };

  const handleEditFaculty = (facultyId) => {
    navigate(`/admin/faculty/${facultyId}/edit`);
    setActionMenuOpen(null);
  };

  const handleViewCourses = (facultyId, username) => {
    navigate(`/admin/faculty/${facultyId}/courses`, { state: { facultyName: username } });
    setActionMenuOpen(null);
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await axiosInstance.delete(`${API_PATHS.ADMIN.FACULTY_USER}/${facultyId}`);
        fetchFaculty(); // Refresh the list
      } catch (err) {
        console.error('Error deleting faculty:', err);
        setError('Failed to delete faculty member. Please try again.');
      }
    }
    setActionMenuOpen(null);
  };

  const handleRestoreFaculty = async (facultyId) => {
    if (window.confirm('Are you sure you want to restore this faculty member?')) {
      try {
        await axiosInstance.post(`${API_PATHS.ADMIN.FACULTY_USER}/${facultyId}/restore`);
        fetchFaculty(); // Refresh the list
      } catch (err) {
        console.error('Error restoring faculty:', err);
        setError('Failed to restore faculty member. Please try again.');
      }
    }
    setActionMenuOpen(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExportData = () => {
    const csvContent = [
      ['ID', 'Username', 'Email', 'Created Date', 'Updated Date', 'Courses', 'Status'],
      ...faculty.map(instructor => [
        instructor.id,
        instructor.username,
        instructor.email,
        formatDate(instructor.created_at),
        formatDate(instructor.updated_at),
        facultyCourseCount[instructor.id] || 0,
        instructor.is_deleted ? 'Deleted' : 'Active'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'faculty.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalFaculty / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalFaculty);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Faculty</h1>
          <button
            onClick={handleAddFaculty}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Faculty
          </button>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative inline-block text-left">
              <button
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setShowDeleted(!showDeleted)}
              >
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
              </button>
            </div>
            
            <button
              onClick={handleExportData}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download className="mr-2 h-4 w-4 text-gray-500" />
              Export
            </button>
            
            <button
              onClick={fetchFaculty}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Faculty table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="ml-2 text-gray-600">Loading faculty members...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchFaculty}
                className="ml-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto h-110">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedFaculty.length === faculty.length && faculty.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort('username')}
                    >
                      <div className="flex items-center">
                        <span>Username</span>
                        {sortField === 'username' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        <span>Email</span>
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div className="flex items-center">
                        <span>Courses</span>
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        <span>Joined</span>
                        {sortField === 'created_at' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort('is_deleted')}
                    >
                      <div className="flex items-center">
                        <span>Status</span>
                        {sortField === 'is_deleted' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {faculty.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                        No faculty members found. Try adjusting your search criteria.
                      </td>
                    </tr>
                  ) : (
                    faculty.map((instructor) => (
                      <tr key={instructor.id} className={`hover:bg-gray-50 ${instructor.is_deleted ? 'bg-red-50' : ''}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedFaculty.includes(instructor.id)}
                              onChange={() => toggleSelectFaculty(instructor.id)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {instructor.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {instructor.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <BookOpen className="mr-1 h-4 w-4 text-indigo-500" />
                            <span>{facultyCourseCount[instructor.id] || 0} courses</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            {formatDate(instructor.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            !instructor.is_deleted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {instructor.is_deleted ? 'Deleted' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => handleActionMenu(instructor.id)}
                              className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            {actionMenuOpen === instructor.id && (
                              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                <button
                                  onClick={() => handleEditFaculty(instructor.id)}
                                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-gray-500" />
                                  Edit Faculty
                                </button>
                                <button
                                  onClick={() => handleViewCourses(instructor.id, instructor.username)}
                                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <BookOpen className="mr-3 h-4 w-4 text-gray-500" />
                                  View Courses
                                </button>
                                <a
                                  href={`mailto:${instructor.email}`}
                                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Mail className="mr-3 h-4 w-4 text-gray-500" />
                                  Email Faculty
                                </a>
                                {!instructor.is_deleted ? (
                                  <button
                                    onClick={() => handleDeleteFaculty(instructor.id)}
                                    className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash className="mr-3 h-4 w-4 text-red-500" />
                                    Delete Faculty
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRestoreFaculty(instructor.id)}
                                    className="flex w-full items-center px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <RefreshCw className="mr-3 h-4 w-4 text-green-500" />
                                    Restore Faculty
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && !error && faculty.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex}</span> to{' '}
                    <span className="font-medium">{endIndex}</span> of{' '}
                    <span className="font-medium">{totalFaculty}</span> faculty members
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                        currentPage === 1 
                          ? 'cursor-not-allowed bg-gray-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 text-blue-600 focus:z-20'
                              : 'text-gray-900 hover:bg-gray-50 focus:z-20'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                        currentPage === totalPages 
                          ? 'cursor-not-allowed bg-gray-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyListingPage;