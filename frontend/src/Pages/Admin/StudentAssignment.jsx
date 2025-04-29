import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Save,
  UserCheck,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  ArrowLeftCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/Layouts/dashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';

/* ------------------------------------------------ */
/* Helpers                                         */
/* ------------------------------------------------ */
const getDisplayName = (obj = {}) =>
  obj.name || obj.title || obj.username || '';

const contains = (haystack = '', needle = '') =>
  haystack.toLowerCase().includes(needle.toLowerCase());

/* ------------------------------------------------ */
/* Pagination Component                            */
/* ------------------------------------------------ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center mt-6 space-x-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowLeft size={18} />
      </button>
      
      <span className="px-4 py-2 text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages || 1}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

/* ------------------------------------------------ */
/* Badge Component                                 */
/* ------------------------------------------------ */
const Badge = ({ children, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };
  
  return (
    <span className={`${colorClasses[color]} text-xs px-3 py-1 rounded-full font-medium`}>
      {children}
    </span>
  );
};

/* ------------------------------------------------ */
/* Component                                       */
/* ------------------------------------------------ */
const StudentAssignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Data states
  const [course, setCourse] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // UI states
  const [studentFilter, setStudentFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Pagination states
  const itemsPerPage = 8;
  const [studentPage, setStudentPage] = useState(1);

  /* ----------------------------- Fetch on mount */
  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [c, f, s] = await Promise.all([
        axiosInstance.get(API_PATHS.COURSE.GET_COURSE_BY_ID(courseId)),
        axiosInstance.get(API_PATHS.COURSE.ALL_FACULTY(courseId)),
        axiosInstance.get(API_PATHS.ADMIN.ALL_STUDENT_USER),
      ]);
      setCourse(c.data);
      setFaculties(f.data);
      setStudents(s.data);
      setSelectedStudents(c.data.students?.map(s => s.id) || []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- Filters & Pagination */
  const filteredStudents = useMemo(
    () => students.filter((s) => contains(getDisplayName(s), studentFilter)),
    [students, studentFilter]
  );

  const paginatedStudents = useMemo(() => {
    const startIndex = (studentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, studentPage]);

  const totalStudentPages = Math.ceil(filteredStudents.length / itemsPerPage);

  /* ----------------------------- Handlers */
  const handleStudentToggle = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const assignStudentsToCourse = async () => {
    if (!course || !selectedFaculty) return;
    try {
      setLoading(true);
      await axiosInstance.post(
        API_PATHS.STUDENT.ASSIGN_STUDENT(course.id),
        {
          facultyIds: [selectedFaculty],
          studentIds: selectedStudents,
        }
      );
      setSuccess('Students assigned successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setError(null);
      fetchData(); // Refresh course data
    } catch (e) {
      console.error(e);
      setError('Failed to assign students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- Render */
  if (loading && !course) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin mr-2 text-blue-600" size={24} />
          <span className="text-gray-600">Loading data...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/courses')}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftCircle size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Assignment - {course ? getDisplayName(course) : 'Loading...'}
            </h1>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} className="mr-2" /> Refresh Data
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg flex justify-between items-center">
            <span className="flex items-center">
              <Check size={18} className="mr-2" />
              {success}
            </span>
            <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Faculty Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <UserCheck size={22} className="mr-2 text-blue-600" />
              Select Faculty
            </h2>
            <select
              value={selectedFaculty || ''}
              onChange={(e) => setSelectedFaculty(e.target.value || null)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a faculty</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>
                  {getDisplayName(f)}
                </option>
              ))}
            </select>
          </div>

          {/* Student Selection */}
          {selectedFaculty && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                  <UserCheck size={22} className="mr-2 text-blue-600" />
                  Assign Students
                </h2>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {paginatedStudents.map(student => (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      selectedStudents.includes(student.id) ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="mr-3 h-5 w-5 text-green-600 rounded"
                      />
                      <label htmlFor={`student-${student.id}`} className="cursor-pointer">
                        <div className="font-medium text-gray-800">{getDisplayName(student)}</div>
                        {student.email && (
                          <div className="text-sm text-gray-600">{student.email}</div>
                        )}
                      </label>
                    </div>
                    {selectedStudents.includes(student.id) && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle size={18} className="mr-1" />
                        Assigned
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredStudents.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={studentPage}
                    totalPages={totalStudentPages}
                    onPageChange={setStudentPage}
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStudents([])}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  Clear Selection
                </button>
                <button
                  onClick={assignStudentsToCourse}
                  disabled={loading || !selectedFaculty}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Assignments
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignment;