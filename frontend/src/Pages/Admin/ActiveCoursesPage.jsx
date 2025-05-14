import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';

import BackButton from '../../components/BackButton';
import DashboardLayout from '../../components/Layouts/admin/dashboardLayout';

const ActiveCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch all active courses
  useEffect(() => {
    const fetchActiveCourses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS.COURSE.ALL_ACTIVE_COURSES);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching active courses:', error);
        toast.error('Failed to load active courses');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCourses();
  }, []);

  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const updateCourseStatus = async (status) => {
    if (!selectedCourse) return;
    
    try {
      setUpdating(true);
      await axiosInstance.patch(
        API_PATHS.COURSE.UPDATE_STATUS(selectedCourse.id), 
        { status }
      );
      
      // Update local state
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
      
      // Show success message
      toast.success(`Course archived successfully`);
      
      closeModal();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <BackButton />  
        <h1 className="text-2xl font-bold mb-6">Active Courses</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No active courses available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(course.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(course)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-gray-50/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Course Management</h2>
            
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <span className="font-medium">Code:</span>
                <span className="col-span-2">{selectedCourse.code}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <span className="font-medium">Title:</span>
                <span className="col-span-2">{selectedCourse.title}</span>
              </div>
              
              <div className="mb-2">
                <span className="font-medium">Description:</span>
                <p className="mt-1 text-gray-600">{selectedCourse.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <span className="font-medium">Current Status:</span>
                <span className="col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {selectedCourse.status}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="mb-4 font-medium">Course actions:</p>
              
              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  disabled={updating}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => updateCourseStatus('ARCHIVED')}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {updating ? 'Processing...' : 'Archive Course'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ActiveCoursesPage;