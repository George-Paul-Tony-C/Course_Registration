import React from 'react';
import { ChevronUp, ChevronDown, Calendar, Clock, BookOpen, Hash } from 'lucide-react';

/**
 * Expanded course details component
 * 
 * @param {Object} props
 * @param {Object} props.course - Course data to display
 * @param {boolean} props.isExpanded - Whether the details are expanded
 * @param {Function} props.onToggleExpand - Function to toggle expanded state
 */
const CourseDetails = ({ 
  course, 
  isExpanded, 
  onToggleExpand 
}) => {
  if (!course) return null;
  
  const {
    title,
    courseId,
    department,
    credits,
    schedule,
    startDate,
    endDate,
    description
  } = course;
  
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden transition-all">
      {/* Header with basic info - always visible */}
      <div className="bg-gray-50 p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {department && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {department}
                </span>
              )}
              {credits && (
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  {credits} Credits
                </span>
              )}
              {courseId && (
                <span className="flex items-center text-xs text-gray-500">
                  <Hash className="h-3 w-3 mr-1" />
                  {courseId}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          
          <button
            onClick={onToggleExpand}
            className="ml-4 flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="animate-expandDown p-4 sm:p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            {startDate && endDate && (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Course Dates</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            
            {schedule && (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Schedule</h4>
                  <p className="mt-1 text-sm text-gray-500">{schedule}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Course Details</h4>
                <p className="mt-1 text-sm text-gray-500">
                  View full syllabus and materials
                </p>
              </div>
            </div>
          </div>
          
          {description && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;