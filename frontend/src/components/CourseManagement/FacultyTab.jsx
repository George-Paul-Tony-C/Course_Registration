import React, { useState, useMemo, useEffect } from 'react';
import { 
  Save, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Info, 
  User, 
  Mail, 
  ChevronRight,
  BookOpen,
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { getDisplayName } from '../../utils/helpers';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

/**
 * Enhanced Faculty assignment tab component
 * 
 * @param {Object} props
 * @param {Array} props.faculties - List of all faculties
 * @param {Array} props.selectedFaculties - List of selected faculty IDs
 * @param {Function} props.onToggleFaculty - Function to toggle faculty selection
 * @param {Function} props.onSave - Function to save faculty assignments
 * @param {Object} props.selectedCourse - Currently selected course
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {Function} props.onTabChange - Function to change the active tab
 */
const FacultyTab = ({ 
  faculties = [], 
  selectedFaculties = [], 
  onToggleFaculty,
  onSave,
  selectedCourse,
  isLoading,
  onTabChange
}) => {
  // Local state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllVisible, setSelectAllVisible] = useState(false);
  const itemsPerPage = 10;
  
  // Reset pagination when course changes
  useEffect(() => {
    setCurrentPage(1);
    setSearch('');
    setFilter('all');
  }, [selectedCourse?.id]);
  
  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Faculty' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'unassigned', label: 'Unassigned' },
  ];
  
  // Filter faculties based on search and filter
  const filteredFaculties = useMemo(() => {
    return faculties.filter(faculty => {
      // Apply search filter
      const matchesSearch = getDisplayName(faculty).toLowerCase().includes(search.toLowerCase()) ||
                          faculty.email?.toLowerCase().includes(search.toLowerCase());
      
      // Apply assignment filter
      const isAssigned = selectedFaculties.includes(faculty.id);
      if (filter === 'assigned' && !isAssigned) return false;
      if (filter === 'unassigned' && isAssigned) return false;
      
      return matchesSearch;
    });
  }, [faculties, search, filter, selectedFaculties]);
  
  // Apply pagination
  const paginatedFaculties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFaculties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFaculties, currentPage]);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: faculties.length,
      assigned: selectedFaculties.length,
      visible: filteredFaculties.length,
      percentage: faculties.length > 0 
        ? Math.round((selectedFaculties.length / faculties.length) * 100) 
        : 0
    };
  }, [faculties, selectedFaculties, filteredFaculties]);

  // Handle select/deselect all visible faculties
  const handleSelectAll = () => {
    const visibleIds = filteredFaculties.map(faculty => faculty.id);
    
    // Check if all visible items are selected
    const allSelected = visibleIds.every(id => selectedFaculties.includes(id));
    
    if (allSelected) {
      // Deselect all visible items
      const newSelected = selectedFaculties.filter(id => !visibleIds.includes(id));
      // Call the toggle function for each ID that needs to be removed
      selectedFaculties
        .filter(id => visibleIds.includes(id))
        .forEach(id => onToggleFaculty(id));
    } else {
      // Select all visible items
      visibleIds
        .filter(id => !selectedFaculties.includes(id))
        .forEach(id => onToggleFaculty(id));
    }
  };

  // Check if all visible faculties are selected
  const allVisibleSelected = useMemo(() => {
    return filteredFaculties.length > 0 && 
           filteredFaculties.every(faculty => selectedFaculties.includes(faculty.id));
  }, [filteredFaculties, selectedFaculties]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setFilter('all');
  };

  return (
    <section className="animate-fadeIn transition-all">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header with course info and actions */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mr-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Faculty Assignment</h3>
            </div>
            
            {selectedCourse && (
              <button
                onClick={onSave}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            )}
          </div>
          
          {selectedCourse ? (
            <div className="flex items-center text-sm mt-2">
              <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Managing faculty for</span>
              <span className="font-medium text-gray-800 ml-1">{selectedCourse.title || 'Current Course'}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-1">
              Select a course to manage its faculty assignments
            </div>
          )}
        </div>
        
        {/* Content area */}
        <div className="p-6">
          {/* Statistics bar */}
          {selectedCourse && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-xs font-medium text-blue-600 uppercase mb-1">Assigned Faculty</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-blue-700">{stats.assigned}</span>
                  <span className="text-blue-600 ml-1">/ {stats.total}</span>
                </div>
                <div className="mt-1 text-xs text-blue-700">
                  {stats.percentage}% of total faculty
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-xs font-medium text-gray-600 uppercase mb-1">Currently Viewing</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-700">{stats.visible}</span>
                  <span className="text-gray-600 ml-1">/ {stats.total}</span>
                </div>
                <div className="mt-1 text-xs text-gray-700">
                  {Math.round((stats.visible / stats.total) * 100) || 0}% of total faculty
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-xs font-medium text-green-600 uppercase mb-1">Assignment Progress</div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-green-200">
                    <div 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-green-700">{stats.percentage}% Complete</div>
                    <div className="text-xs text-green-700 font-medium">{stats.assigned} Selected</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search and filter */}
          <div className="mb-5">
            <SearchFilter 
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search faculty by name or email..."
              filterValue={filter}
              onFilterChange={setFilter}
              filterOptions={filterOptions}
            />
            
            {/* Additional actions when filtering */}
            {(search || filter !== 'all') && (
              <div className="flex items-center justify-between mt-2 text-sm">
                <div className="text-gray-600">
                  Showing <span className="font-medium">{filteredFaculties.length}</span> of <span className="font-medium">{faculties.length}</span> faculty members
                </div>
                <button 
                  onClick={clearFilters}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="h-10 w-10 animate-spin text-blue-500 mb-3" />
              <p className="text-gray-600 font-medium">Loading faculty data...</p>
            </div>
          ) : !selectedCourse ? (
            <EmptyState 
              icon={<Info className="h-14 w-14 text-blue-400" />}
              title="Select a Course"
              description="Please select a course to manage its faculty assignments."
              actionText="Browse Courses"
              onAction={() => onTabChange && onTabChange('courses')}
            />
          ) : paginatedFaculties.length === 0 ? (
            <EmptyState 
              icon={<Users className="h-14 w-14 text-gray-400" />}
              title="No Faculty Found"
              description="No faculty members match your search criteria."
              actionText="Clear Filters"
              onAction={clearFilters}
            />
          ) : (
            <>
              {/* Faculty list */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Select all header */}
                <div 
                  className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200"
                  onMouseEnter={() => setSelectAllVisible(true)}
                  onMouseLeave={() => setSelectAllVisible(false)}
                >
                  <div className="flex items-center">
                    <button 
                      onClick={handleSelectAll}
                      className="mr-3 p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      {allVisibleSelected ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    <span className={`text-sm font-medium ${selectAllVisible ? 'text-blue-600' : 'text-gray-600'}`}>
                      {allVisibleSelected ? 'Deselect All' : 'Select All'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{filteredFaculties.length}</span> faculty members
                  </div>
                </div>
                
                {/* Faculty list */}
                <div className="max-h-96 overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {paginatedFaculties.map(faculty => (
                      <label 
                        key={faculty.id} 
                        className={`flex cursor-pointer items-center p-4 transition-all duration-200 hover:bg-gray-50 ${
                          selectedFaculties.includes(faculty.id) ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFaculties.includes(faculty.id)}
                          onChange={() => onToggleFaculty(faculty.id)}
                          className="mr-4 h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="p-1.5 rounded-full bg-blue-100 text-blue-700 mr-3">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{getDisplayName(faculty)}</div>
                              {faculty.email && (
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {faculty.email}
                                </div>
                              )}
                              {faculty.department && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {faculty.department}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedFaculties.includes(faculty.id) ? (
                            <div className="p-1 rounded-full bg-blue-100">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 animate-fadeIn" />
                            </div>
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Pagination */}
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                  <Pagination 
                    currentPage={currentPage}
                    totalItems={filteredFaculties.length}
                    pageSize={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
              
              {/* Selection summary */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">{selectedFaculties.length}</span> faculty members assigned to this course
                </div>
                
                {selectedFaculties.length > 0 && (
                  <button
                    onClick={onSave}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FacultyTab;