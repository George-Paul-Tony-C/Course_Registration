import React, { useState, useMemo, useEffect } from 'react';
import {
  Save,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Search,
  Filter,
  BookOpen,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { getDisplayName } from '../../utils/helpers';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

/* ---------------------------------------------------------------------------
 * props
 * ---------------------------------------------------------------------------
 * students           – full student list for the course (array of objects)
 * selectedStudents   – id[] currently ticked
 * onToggleStudent    – fn(id) → toggles in parent state
 * onSave             – save handler from parent
 * selectedCourse     – course object (or null)
 * isLoading          – boolean
 * facultyOptions     – [{id, …}] radio list of faculty supervising this course
 * chosenFaculty      – id | null
 * onFacultyChange    – fn(id)   radio change handler (parent sets selectedStudents)
 * ------------------------------------------------------------------------- */
export default function StudentTab({
  students = [],
  selectedStudents = [],
  onToggleStudent,
  onSave,
  selectedCourse,
  isLoading,
  facultyOptions = [],
  chosenFaculty,
  onFacultyChange,
}) {
  /* ------------------------------------------------------------------ */
  /* local UI state                                                     */
  /* ------------------------------------------------------------------ */
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');          // all | enrolled | not-enrolled
  const [page, setPage] = useState(1);
  const [facultyExpanded, setFacultyExpanded] = useState(true);
  const perPage = 10;

  /* reset filters when course changes */
  useEffect(() => {
    setSearch('');
    setFilter('all');
    setPage(1);
  }, [selectedCourse?.id]);

  /* ------------------------------------------------------------------ */
  /* filtered + paged list                                              */
  /* ------------------------------------------------------------------ */
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const match =
        getDisplayName(s).toLowerCase().includes(search.toLowerCase()) ||
        (s.email ?? '').toLowerCase().includes(search.toLowerCase());

      if (!match) return false;

      const enrolled = selectedStudents.includes(s.id);
      if (filter === 'enrolled' && !enrolled) return false;
      if (filter === 'not-enrolled' && enrolled) return false;

      return true;
    });
  }, [students, search, filter, selectedStudents]);

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // Get selected faculty name
  const selectedFacultyName = useMemo(() => {
    if (!chosenFaculty) return null;
    const faculty = facultyOptions.find(f => f.id === chosenFaculty);
    return faculty ? getDisplayName(faculty) : null;
  }, [chosenFaculty, facultyOptions]);

  // Stats for enrollment
  const enrollmentStats = useMemo(() => {
    return {
      selected: selectedStudents.length,
      total: students.length,
      percentage: students.length ? Math.round((selectedStudents.length / students.length) * 100) : 0
    };
  }, [selectedStudents, students]);

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <section className="animate-fadeIn transition-all">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* header ------------------------------------------------------ */}
        <div className="mb-6 bg-gradient-to-r from-green-50 p-6 to-white flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-300">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                <UserPlus className="h-5 w-5" />
              </div>
              Student Enrollment
            </h3>
            {selectedCourse && (
              <p className="text-sm text-gray-500 my-2 flex items-center">
                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                Managing students for <span className="font-medium text-gray-700">{selectedCourse.title || 'Selected Course'}</span>
              </p>
            )}
          </div>

          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            <Save className="h-4 w-4" />
            Save Enrollment
          </button>
        </div>

        <div className='p-6'>

        

        {/* faculty selector section ------------------------------------ */}
        <div className="mb-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer"
            onClick={() => setFacultyExpanded(!facultyExpanded)}
          >
            <h4 className="font-medium text-gray-800 flex items-center">
              <UserCheck size={18} className="mr-2 text-blue-600" />
              Supervising Faculty
            </h4>
            {facultyExpanded ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </div>
          
          {facultyExpanded && (
            <div className="p-4">
              {facultyOptions.length ? (
                <>
                  {selectedFacultyName && (
                    <div className="mb-3 text-sm text-blue-700 font-medium flex items-center">
                      <CheckCircle2 size={16} className="mr-2 text-blue-600" />
                      Current selection: {selectedFacultyName}
                    </div>
                  )}
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-200">
                    {facultyOptions.map((f) => (
                      <label
                        key={f.id}
                        className={`flex cursor-pointer items-center px-4 py-3 transition-all duration-200 hover:bg-gray-50 ${
                          chosenFaculty === f.id ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="facultyPicker"
                          className="h-4 w-4 mr-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                          checked={chosenFaculty === f.id}
                          onChange={() => onFacultyChange(f.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{getDisplayName(f)}</div>
                          {f.email && (
                            <div className="text-sm text-gray-500 mt-0.5">{f.email}</div>
                          )}
                        </div>
                        {chosenFaculty === f.id && (
                          <CheckCircle2 size={18} className="text-blue-500" />
                        )}
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<Info className="h-10 w-10 text-gray-400" />}
                  title="No faculty assigned"
                  description="Assign at least one faculty to this course first."
                  actionText="Manage Faculty"
                  onAction={() => {/* Add navigation to faculty tab if needed */}}
                />
              )}
            </div>
          )}
        </div>

        {/* Enrollment Status Stats -------------------------------------- */}
        {selectedStudents.length > 0 && (
          <div className="mb-5 bg-green-50 rounded-lg p-3 border border-green-100 flex items-center justify-between">
            <div className="flex items-center text-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2"/>
              <span className="font-medium">{enrollmentStats.selected}</span>
              <span className="text-green-700 mx-1">of</span>
              <span className="font-medium">{enrollmentStats.total}</span>
              <span className="text-green-700 ml-1">students selected</span>
              {selectedFacultyName && (
                <span className="ml-1">for <span className="font-medium">{selectedFacultyName}</span></span>
              )}
            </div>
            <div className="text-sm text-green-700 font-medium">
              {enrollmentStats.percentage}%
            </div>
          </div>
        )}

        {/* search / filter --------------------------------------------- */}
        <div className="mb-5">
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search students by name or email..."
            filterValue={filter}
            onFilterChange={setFilter}
            filterOptions={[
              { value: 'all', label: 'All Students' },
              { value: 'enrolled', label: 'Enrolled' },
              { value: 'not-enrolled', label: 'Not Enrolled' },
            ]}
          />
        </div>

        {/* list --------------------------------------------------------- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
            <Clock className="h-10 w-10 animate-spin text-green-500 mb-3" />
            <p className="text-gray-600 font-medium">Loading student data...</p>
          </div>
        ) : !selectedCourse ? (
          <EmptyState
            icon={<BookOpen className="h-14 w-14 text-blue-400" />}
            title="Select a Course"
            description="Please select a course to manage student enrollment."
          />
        ) : paged.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="h-14 w-14 text-gray-400" />}
            title="No Students Found"
            description="No students match your search criteria."
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setFilter('all');
            }}
          />
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {paged.map((s) => (
                    <li
                      key={s.id}
                      className={`transition-all duration-200 ${
                        selectedStudents.includes(s.id)
                          ? 'bg-green-50 border-l-4 border-green-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <label className="flex cursor-pointer items-center p-4">
                        <input
                          type="checkbox"
                          className="h-5 w-5 mr-4 rounded border-gray-300 text-green-600 transition-colors focus:ring-green-500"
                          checked={selectedStudents.includes(s.id)}
                          onChange={() => onToggleStudent(s.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{getDisplayName(s)}</div>
                          {s.email && (
                            <div className="text-sm text-gray-500 mt-0.5 flex items-center">
                              <span className="inline-block w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
                                @
                              </span>
                              {s.email}
                            </div>
                          )}
                          {s.id && (
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {s.id}
                            </div>
                          )}
                        </div>
                        {selectedStudents.includes(s.id) && (
                          <CheckCircle2 size={20} className="text-green-500 animate-fadeIn" />
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pagination controls */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <Pagination
                  currentPage={page}
                  totalItems={filtered.length}
                  pageSize={perPage}
                  onPageChange={setPage}
                />
              </div>
            </div>

            {/* Warning messages when faculty not selected */}
            {selectedStudents.length > 0 && !chosenFaculty && (
              <div className="mt-4 flex items-center p-3 text-sm rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                <AlertCircle size={18} className="mr-2 text-amber-600" />
                Please select a supervising faculty member for these students
              </div>
            )}
          </>
        )}

        </div>
      </div>
    </section>
  );
}