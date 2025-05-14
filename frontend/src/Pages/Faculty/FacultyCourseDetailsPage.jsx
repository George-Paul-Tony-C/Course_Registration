import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader, AlertCircle, ArrowLeft, Plus, Pencil, Trash2, 
  GripVertical, Settings, Users, FileText, Calendar, BookOpen,
  ChevronDown, ChevronUp, Clock, Save, X, Video, Image, FileQuestion
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FacultyDashboardLayout from '../../components/Layouts/faculty/FacultyDashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS_FACULTY } from '../../utils/api_paths';

// Helper function to get icon based on content type
const getContentTypeIcon = (type) => {
  switch (type) {
    case 'VIDEO':
      return <Video size={16} className="text-red-500" />;
    case 'IMAGE':
      return <Image size={16} className="text-blue-500" />;
    case 'QUIZ':
      return <FileQuestion size={16} className="text-purple-500" />;
    default:
      return <FileText size={16} className="text-gray-500" />;
  }
};

// Content type badge component
const ContentTypeBadge = ({ type }) => {
  const getBgColor = () => {
    switch (type) {
      case 'VIDEO': return 'bg-red-100 text-red-800';
      case 'IMAGE': return 'bg-blue-100 text-blue-800';
      case 'QUIZ': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBgColor()}`}>
      {getContentTypeIcon(type)}
      <span className="ml-1">{type}</span>
    </span>
  );
};

export default function FacultyCourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [dirtyModules, setDirtyModules] = useState(false);
  
  // Refs for scrolling
  const moduleRefs = useRef({});

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS_FACULTY.GET_COURSE_BY_ID(courseId));
        const payload = response.data;
        
        if (payload.success) {
          setCourse(payload.data);
          
          // Initialize expanded state for all modules
          const expanded = {};
          payload.data.modules.forEach(module => {
            expanded[module.id] = true;
          });
          setExpandedModules(expanded);
        } else {
          setError('Failed to fetch course details');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching course details');
      } finally {
        setLoading(false);
      }
    }
    
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // Handle module expansion toggle
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Handle drag end for modules or content
  const handleDragEnd = (result) => {
    const { source, destination, type } = result;
    
    // If dropped outside the list or same position, do nothing
    if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
      return;
    }
    
    // Make a deep copy of the course
    const updatedCourse = JSON.parse(JSON.stringify(course));
    
    if (type === 'module') {
      // Reorder modules
      const [movedModule] = updatedCourse.modules.splice(source.index, 1);
      updatedCourse.modules.splice(destination.index, 0, movedModule);
      
      // Update displayOrder for all modules
      updatedCourse.modules.forEach((module, index) => {
        module.displayOrder = index;
      });
      
      setCourse(updatedCourse);
      setDirtyModules(true);
    } else if (type === 'content') {
      // Extract module IDs from droppableIds
      const sourceModuleId = parseInt(source.droppableId.split('-')[1]);
      const destModuleId = parseInt(destination.droppableId.split('-')[1]);
      
      // Find source and destination modules
      const sourceModuleIndex = updatedCourse.modules.findIndex(m => m.id === sourceModuleId);
      const destModuleIndex = updatedCourse.modules.findIndex(m => m.id === destModuleId);
      
      if (sourceModuleIndex !== -1 && destModuleIndex !== -1) {
        // Move content within same module or between modules
        const sourceContents = updatedCourse.modules[sourceModuleIndex].contents;
        const [movedContent] = sourceContents.splice(source.index, 1);
        
        if (sourceModuleId === destModuleId) {
          // Same module
          sourceContents.splice(destination.index, 0, movedContent);
        } else {
          // Different modules
          updatedCourse.modules[destModuleIndex].contents.splice(destination.index, 0, movedContent);
        }
        
        // Update displayOrder for affected modules' contents
        updatedCourse.modules[sourceModuleIndex].contents.forEach((content, index) => {
          content.displayOrder = index;
        });
        
        if (sourceModuleId !== destModuleId) {
          updatedCourse.modules[destModuleIndex].contents.forEach((content, index) => {
            content.displayOrder = index;
          });
        }
      }
      
      setCourse(updatedCourse);
      setDirtyModules(true);
    }
  };

  // Save the updated order
  const saveOrder = async () => {
    try {
      setSavingOrder(true);
      
      // Prepare data for API - only send what's needed
      const modulesData = course.modules.map(module => ({
        id: module.id,
        displayOrder: module.displayOrder,
        contents: module.contents.map(content => ({
          id: content.id,
          displayOrder: content.displayOrder
        }))
      }));
      
      // Send update to API
      await axiosInstance.put(API_PATHS_FACULTY.UPDATE_COURSE_ORDER(courseId), {
        modules: modulesData
      });
      
      setDirtyModules(false);
      
      // Show success toast or notification here
    } catch (err) {
      console.error(err);
      // Show error toast or notification here
    } finally {
      setSavingOrder(false);
    }
  };

  // Scroll to a specific module
  const scrollToModule = (moduleId) => {
    if (moduleRefs.current[moduleId]) {
      moduleRefs.current[moduleId].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <FacultyDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading course details...</span>
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

  if (!course) {
    return (
      <FacultyDashboardLayout>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-center">
          <AlertCircle className="text-yellow-500 mr-3" />
          <p className="text-yellow-700">Course not found</p>
        </div>
      </FacultyDashboardLayout>
    );
  }

  return (
    <FacultyDashboardLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <button 
                onClick={() => navigate('/faculty/courses')}
                className="mr-3 text-gray-500 hover:text-gray-700 flex items-center"
              >
                <ArrowLeft size={16} />
                <span className="ml-1">Back to courses</span>
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{course.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded mr-3">{course.code}</span>
                  <span className={`px-2 py-0.5 rounded ${course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center px-4 py-2 rounded-md ${editMode 
                    ? 'bg-gray-200 text-gray-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {editMode ? (
                    <>
                      <X size={16} className="mr-1" />
                      <span>Cancel Edit</span>
                    </>
                  ) : (
                    <>
                      <Pencil size={16} className="mr-1" />
                      <span>Edit Content</span>
                    </>
                  )}
                </button>
                {editMode && dirtyModules && (
                  <button 
                    onClick={saveOrder}
                    disabled={savingOrder}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {savingOrder ? (
                      <>
                        <Loader size={16} className="animate-spin mr-1" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-1" />
                        <span>Save Order</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'overview' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen size={16} className="mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'students' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users size={16} className="mr-2" />
                Students ({course.students.length})
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`py-4 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'quizzes' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileQuestion size={16} className="mr-2" />
                Quizzes ({course.quizzes.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 text-sm font-medium flex items-center ${
                  activeTab === 'settings' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  {editMode && (
                    <button className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                      <Plus size={16} className="mr-1" />
                      Add Module
                    </button>
                  )}
                </div>

                {/* Module Navigation (Quick Jump) */}
                {course.modules.length > 1 && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Jump to Module:</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.modules.map((module, index) => (
                        <button
                          key={module.id}
                          onClick={() => scrollToModule(module.id)}
                          className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                        >
                          Module {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modules List with Drag and Drop */}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="modules" type="module" isDropDisabled={!editMode}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-6"
                      >
                        {course.modules.map((module, index) => (
                          <Draggable
                            key={module.id}
                            draggableId={`module-${module.id}`}
                            index={index}
                            isDragDisabled={!editMode}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={(el) => {
                                  provided.innerRef(el);
                                  moduleRefs.current[module.id] = el;
                                }}
                                {...provided.draggableProps}
                                className={`border rounded-lg ${snapshot.isDragging ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                              >
                                <div className="bg-gray-50 p-4 rounded-t-lg flex items-center justify-between">
                                  <div className="flex items-center">
                                    {editMode && (
                                      <div {...provided.dragHandleProps} className="mr-3 cursor-grab">
                                        <GripVertical size={20} className="text-gray-400" />
                                      </div>
                                    )}
                                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                                    <span className="ml-3 text-sm text-gray-500">{module.contentCount} items</span>
                                  </div>
                                  <div className="flex items-center">
                                    {editMode && (
                                      <>
                                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                                          <Pencil size={16} />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800 mr-4">
                                          <Trash2 size={16} />
                                        </button>
                                      </>
                                    )}
                                    <button 
                                      onClick={() => toggleModule(module.id)}
                                      className="p-1 hover:bg-gray-200 rounded"
                                    >
                                      {expandedModules[module.id] ? (
                                        <ChevronUp size={18} className="text-gray-500" />
                                      ) : (
                                        <ChevronDown size={18} className="text-gray-500" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                
                                {expandedModules[module.id] && (
                                  <Droppable 
                                    droppableId={`content-${module.id}`} 
                                    type="content"
                                    isDropDisabled={!editMode}
                                  >
                                    {(provided) => (
                                      <div 
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="p-4 divide-y divide-gray-100"
                                      >
                                        {module.contents.length === 0 ? (
                                          <div className="py-4 text-center text-gray-500 italic">
                                            No content in this module
                                          </div>
                                        ) : (
                                          module.contents.map((content, idx) => (
                                            <Draggable
                                              key={content.id}
                                              draggableId={`content-${content.id}`}
                                              index={idx}
                                              isDragDisabled={!editMode}
                                            >
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className={`py-3 flex items-center ${snapshot.isDragging ? 'bg-gray-50 rounded' : ''}`}
                                                >
                                                  {editMode && (
                                                    <div {...provided.dragHandleProps} className="mr-3 cursor-grab">
                                                      <GripVertical size={16} className="text-gray-400" />
                                                    </div>
                                                  )}
                                                  {getContentTypeIcon(content.type)}
                                                  <div className="ml-3 flex-1">
                                                    <div className="font-medium text-gray-900">{content.title}</div>
                                                    <div className="flex items-center mt-1">
                                                      <ContentTypeBadge type={content.type} />
                                                      {content.file && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                          {content.file.original_name}
                                                        </span>
                                                      )}
                                                      {content.youtubeUrl && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                          YouTube Video
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  {editMode && (
                                                    <div className="flex items-center">
                                                      <button className="p-1 text-blue-600 hover:text-blue-800 mr-1">
                                                        <Pencil size={16} />
                                                      </button>
                                                      <button className="p-1 text-red-600 hover:text-red-800">
                                                        <Trash2 size={16} />
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </Draggable>
                                          ))
                                        )}
                                        {provided.placeholder}
                                        {editMode && (
                                          <div className="pt-4">
                                            <button className="flex items-center text-sm px-3 py-2 border border-dashed border-gray-300 rounded-md w-full justify-center hover:bg-gray-50 text-gray-600">
                                              <Plus size={16} className="mr-1" />
                                              Add Content to this Module
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Droppable>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {course.modules.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 rounded-lg p-6 inline-block">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">No modules yet</h3>
                      <p className="text-gray-500 mt-1">
                        Create your first module to start adding content
                      </p>
                      {editMode && (
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Create Module
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Enrolled Students</h2>
                  <button className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                    <Plus size={16} className="mr-1" />
                    Add Students
                  </button>
                </div>

                {course.students.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 rounded-lg p-6 inline-block">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">No students enrolled</h3>
                      <p className="text-gray-500 mt-1">
                        Students can be added manually or via enrollment code
                      </p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Generate Enrollment Code
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrolled Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {course.students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{student.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-500">{student.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(student.enrolledAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {/* Placeholder for progress - would be dynamic in real app */}
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <span className="ml-2 text-xs text-gray-500">45%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                              <button className="text-red-600 hover:text-red-900">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Course Quizzes</h2>
                  <button className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                    <Plus size={16} className="mr-1" />
                    Create Quiz
                  </button>
                </div>

                {course.quizzes.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 rounded-lg p-6 inline-block">
                      <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">No quizzes available</h3>
                      <p className="text-gray-500 mt-1">
                        Create quizzes to assess student learning
                      </p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Create Your First Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.quizzes.map((quiz) => (
                      <div key={quiz.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                          <ContentTypeBadge type="QUIZ" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <FileText size={16} className="mr-1" />
                              <span>{quiz.totalMarks} marks</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={16} className="mr-1" />
                              <span>Due {new Date(quiz.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-500">
                              <Users size={16} className="mr-1" />
                              <span>{quiz.attemptCount} attempts</span>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">View</button>
                              <button className="text-blue-600 hover:text-blue-800">Edit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-6">Course Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="p-5 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                          <input 
                            type="text" 
                            value={course.title}
                            disabled={!editMode}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                          <input 
                            type="text" 
                            value={course.code}
                            disabled={!editMode}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea 
                            value={course.description}
                            disabled={!editMode}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                      </div>
                      {editMode && (
                        <div className="mt-4 flex justify-end">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Update Basic Info
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Course Status */}
                    <div className="p-5 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Course Status</h3>
                      <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-700">Current status:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      
                      {editMode && (
                        <div className="mt-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="status-active" 
                                name="status" 
                                value="ACTIVE"
                                checked={course.status === 'ACTIVE'}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                              />
                              <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                                Active (visible to students)
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="status-pending" 
                                name="status" 
                                value="PENDING"
                                checked={course.status === 'PENDING'}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                              />
                              <label htmlFor="status-pending" className="ml-2 block text-sm text-gray-700">
                                Pending (hidden from students)
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="status-archived" 
                                name="status" 
                                value="ARCHIVED"
                                checked={course.status === 'ARCHIVED'}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                              />
                              <label htmlFor="status-archived" className="ml-2 block text-sm text-gray-700">
                                Archived (read-only access)
                              </label>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                              Update Status
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Access Control */}
                    <div className="p-5 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Access Control</h3>
                      
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            disabled={!editMode}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                          />
                          <span className="ml-2 text-sm text-gray-700">Require enrollment code</span>
                        </label>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">Current enrollment code:</label>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">XYZ123</span>
                        </div>
                        {editMode && (
                          <div className="mt-2 flex">
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              Generate new code
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editMode && (
                        <div className="mt-4 flex justify-end">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Update Access Settings
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Danger Zone */}
                    <div className="p-5 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Archive this course</h4>
                              <p className="text-sm text-gray-500">Make this course read-only for all users</p>
                            </div>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                              Archive
                            </button>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-red-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Delete this course</h4>
                              <p className="text-sm text-gray-500">Permanently delete this course and all its data</p>
                            </div>
                            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course Stats Quick View */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Enrolled Students</div>
                <div className="text-xl font-semibold">{course.students.length}</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <FileQuestion size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Quizzes</div>
                <div className="text-xl font-semibold">{course.quizzes.length}</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Clock size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Last Updated</div>
                <div className="text-xl font-semibold">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FacultyDashboardLayout>
  );
}