import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';
import DashboardLayout from '../../components/Layouts/admin/dashboardLayout';
import BackButton from '../../components/BackButton';

const AddCoursePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      await axiosInstance.post(API_PATHS.ADMIN.ALL_COURSES, data);
      toast.success('Course added successfully!');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error.response?.data?.message || 'Failed to add course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <BackButton />  
        <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Course Code
              </label>
              <input
                id="code"
                type="text"
                className={`w-full px-3 py-2 border rounded-lg ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 19CS501"
                {...register('code', { 
                  required: 'Course code is required',
                  pattern: {
                    value: /^\d{2}[A-Z]{2}\d{3}$/,
                    message: 'Course code must be in format: YYDDnnn (e.g. 19CS501)'
                  }
                })}
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Course Title
              </label>
              <input
                id="title"
                type="text"
                className={`w-full px-3 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter course title"
                {...register('title', { required: 'Course title is required' })}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter course description"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={`w-full px-3 py-2 border rounded-lg ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                {...register('status', { required: 'Status is required' })}
              >
                <option value="">Select status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Course'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/courses')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddCoursePage;