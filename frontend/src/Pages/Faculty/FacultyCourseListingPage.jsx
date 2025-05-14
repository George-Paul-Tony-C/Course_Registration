import { useState, useEffect, useContext } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader, AlertCircle, Book, Users, Calendar, ExternalLink } from 'lucide-react';
import FacultyDashboardLayout from '../../components/Layouts/faculty/FacultyDashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS_FACULTY } from '../../utils/api_paths';
import { AuthCtx } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function FacultyCourseListingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthCtx);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('active');
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS_FACULTY.ALL_COURSES);
        const payload = response.data;
        if (payload.success) {
          setCourses(payload.data);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching courses');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Search filter
  const filtered = courses.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortBy === 'studentCount') {
      return sortDirection === 'asc'
        ? a.studentCount - b.studentCount
        : b.studentCount - a.studentCount;
    }
    return 0;
  });

  // Tabs data
  const activeCourses = sorted.filter((c) => c.status === 'ACTIVE');
  const pendingCourses = sorted.filter(
    (c) => c.status === 'PENDING' && c.created_by === user.id
  );

  // Pagination
  const displayList = activeTab === 'active' ? activeCourses : pendingCourses;
  const totalPages = Math.ceil(displayList.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = displayList.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const navigateToCourse = (courseId) => {
    navigate(`/faculty/courses/${courseId}`);
  };

  if (loading) {
    return (
      <FacultyDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      </FacultyDashboardLayout>
    );
  }

  if (error) {
    return (
      <FacultyDashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      </FacultyDashboardLayout>
    );
  }

  return (
    <FacultyDashboardLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === 'active' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                >
                  Active Courses
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === 'pending' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
                >
                  Pending Courses
                </button>
              </div>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or code"
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="title">Title</option>
                    <option value="studentCount">Students</option>
                  </select>
                </div>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                </button>
              </div>
            </div>

            {/* Courses Grid View */}
            {currentItems.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search term" : `You don't have any ${activeTab} courses yet`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 mb-6">
                {currentItems.map((course) => (
                  <div 
                    key={course.id} 
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigateToCourse(course.id)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                            {course.code}
                          </span>
                          {course.status === 'ACTIVE' ? (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col justify-center space-y-4 border-t md:border-t-0 md:border-l border-gray-200">
                        {activeTab === 'active' && (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-600">Students</span>
                              </div>
                              <span className="text-lg font-semibold text-gray-900">{course.studentCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Book className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-600">Modules</span>
                              </div>
                              <span className="text-lg font-semibold text-gray-900">{course.moduleCount}</span>
                            </div>
                          </>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToCourse(course.id);
                          }} 
                          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center transition-colors"
                        >
                          View Course <ExternalLink className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-center space-x-1 w-full">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <ChevronLeft className="h-5 w-5 -ml-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const middlePoint = Math.min(Math.max(currentPage, 3), totalPages - 2);
                      pageNum = i + middlePoint - 2;
                      
                      if (pageNum < 1) pageNum = i + 1;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                    <ChevronRight className="h-5 w-5 -ml-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FacultyDashboardLayout>
  );
}