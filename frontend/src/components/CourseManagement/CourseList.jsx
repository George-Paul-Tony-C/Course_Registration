import React, { useState, useMemo, useEffect } from 'react';
import { Users, UserPlus, RefreshCw, Calendar, Hash, Search, BookOpen, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Enhanced Course list with search, filter functionality and improved UI
 * 
 * @param {Object} props
 * @param {Array} props.courses - List of courses
 * @param {Object|null} props.selectedCourse - Currently selected course
 * @param {Function} props.onSelectCourse - Function to select a course
 * @param {boolean} props.isLoading - Whether courses are loading
 * @param {Function} props.onRefresh - Function to refresh course data
 */
const CourseList = ({
  courses = [],
  selectedCourse,
  onSelectCourse,
  isLoading,
  onRefresh
}) => {
  // Local state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleFilters, setVisibleFilters] = useState(false);
  const itemsPerPage = 8;
  
  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Courses', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'active', label: 'Active', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'upcoming', label: 'Upcoming', icon: <Clock className="h-4 w-4" /> },
    { value: 'past', label: 'Past', icon: <XCircle className="h-4 w-4" /> },
  ];
  
  // Filter courses based on search and filter
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Apply search filter (case insensitive)
      const matchesSearch = !search ? true : (
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.courseId?.toString().toLowerCase().includes(search.toLowerCase()) ||
        course.department?.toLowerCase().includes(search.toLowerCase())
      );
      
      // Apply status filter
      const now = new Date();
      const startDate = course.startDate ? new Date(course.startDate) : null;
      const endDate = course.endDate ? new Date(course.endDate) : null;
      
      if (filter === 'active' && (!startDate || !endDate || startDate > now || endDate < now)) {
        return false;
      }
      if (filter === 'upcoming' && (!startDate || startDate <= now)) {
        return false;
      }
      if (filter === 'past' && (!endDate || endDate >= now)) {
        return false;
      }
      
      return matchesSearch;
    });
  }, [courses, search, filter]);
  
  // Apply pagination
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage]);
  
  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Get course status
  const getCourseStatus = (course) => {
    const now = new Date();
    const startDate = course.startDate ? new Date(course.startDate) : null;
    const endDate = course.endDate ? new Date(course.endDate) : null;
    
    return { label: 'Active', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3 mr-1" /> };
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Search and Filter component
  const SearchAndFilter = () => (
    <div className="mb-4 space-y-3">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, ID or department..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex items-center rounded-full px-3 py-1 text-sm transition-colors ${
              filter === option.value
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1.5">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
  
  // Empty state component
  const EmptyState = () => (
    <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
      <Search className="h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No Courses Found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
  
  // Pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredCourses.length)}
          </span>{' '}
          of <span className="font-medium">{filteredCourses.length}</span> courses
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          {[...Array(totalPages).keys()].map(i => {
            const page = i + 1;
            // Show first page, last page, current page and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[32px] rounded-md px-2 py-1 text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              (page === currentPage - 2 && currentPage > 3) ||
              (page === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return (
                <span key={page} className="flex items-center justify-center px-1 text-gray-500">
                  ...
                </span>
              );
            }
            return null;
          })}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-full flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
          <div className="ml-3 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {filteredCourses.length} total
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <SearchAndFilter />
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Loading courses...</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-3 overflow-y-auto pr-1">
            {paginatedCourses.map(course => {
              const status = getCourseStatus(course);
              
              return (
                <button
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className={`w-full rounded-lg border p-4 text-left transition-all hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedCourse?.id === course.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {course.department && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          {course.department}
                        </span>
                      )}
                      {course.courseId && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Hash className="h-3 w-3 mr-0.5" />
                          {course.courseId}
                        </span>
                      )}
                      <span className={`flex items-center rounded-full ${status.color} px-2 py-0.5 text-xs font-medium`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 line-clamp-1">{course.title}</h3>
                  
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {course.startDate && (
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-gray-400" />
                          <span>{formatDate(course.startDate)}</span>
                          {course.endDate && (
                            <>
                              <span className="mx-1">-</span>
                              <span>{formatDate(course.endDate)}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="mr-1 h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs font-medium">
                          {course.facultyCount || 0} Faculty
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <UserPlus className="mr-1 h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs font-medium">
                          {course.studentCount || 0} Students
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {filteredCourses.length > itemsPerPage && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <Pagination />
        </div>
      )}
    </div>
  );
};

export default CourseList;