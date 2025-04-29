import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layouts/dashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';
import { useNavigate } from 'react-router-dom';

const CourseListingPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(5);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.ADMIN.ALL_COURSES);
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = () => {
        navigate('/admin/courses/new');
      };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Get current courses for pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                        onClick={handleAddCourse}
                    >
                        Add New Course
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentCourses.length > 0 ? (
                                        currentCourses.map((course) => (
                                            <tr key={course.id} className={course.is_deleted ? "bg-gray-100" : ""}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {course.description.length > 100 
                                                        ? `${course.description.substring(0, 100)}...` 
                                                        : course.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            className="text-blue-600 hover:text-blue-900"
                                                            onClick={() => {/* View course details */}}
                                                        >
                                                            View
                                                        </button>
                                                        <button 
                                                            className="text-green-600 hover:text-green-900"
                                                            onClick={() => {/* Edit course */}}
                                                        >
                                                            Edit
                                                        </button>
                                                        {course.is_deleted ? (
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-900"
                                                                onClick={() => {/* Restore course */}}
                                                            >
                                                                Restore
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => {/* Delete course */}}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No courses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {courses.length > coursesPerPage && (
                            <div className="flex justify-center mt-6">
                                <nav className="flex items-center">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`mx-1 px-3 py-1 rounded ${
                                            currentPage === 1 
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`mx-1 px-3 py-1 rounded ${
                                                currentPage === index + 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
                                        className={`mx-1 px-3 py-1 rounded ${
                                            currentPage === Math.ceil(courses.length / coursesPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CourseListingPage;