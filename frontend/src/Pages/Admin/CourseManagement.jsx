import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import DashboardLayout from '../../components/Layouts/dashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';

import CourseList from '../../components/CourseManagement/CourseList';
import CourseDetails from '../../components/CourseManagement/CourseDetails';
import FacultyTab from '../../components/CourseManagement/FacultyTab';
import StudentTab from '../../components/CourseManagement/StudentTab';
import NotificationBanner from '../../components/CourseManagement/NotificationBanner';
import EmptyState from '../../components/CourseManagement/EmptyState';

export default function CourseManagement() {
  /* -------------------- data -------------------- */
  const [courses,    setCourses]    = useState([]);
  const [faculties,  setFaculties]  = useState([]);
  const [students,   setStudents]   = useState([]);

  /* ------------- course‑specific state ---------- */
  const [selectedCourse,    setSelectedCourse] = useState(null);
  const [selectedFaculties, setSelectedFaculties] = useState([]);      // ids attached to course
  const [studentsByFaculty, setStudentsByFaculty] = useState({});      // { facultyId: [studentIds] }
  const [selectedStudents,  setSelectedStudents]  = useState([]);      // ids currently ticked in UI
  const [chosenFaculty,     setChosenFaculty]     = useState(null);    // radio‑picked supervisor

  /* ------------------ ui state ------------------ */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [notice,  setNotice]  = useState(null);
  const [activeTab, setActiveTab] = useState('faculty');
  const [showDetails, setShowDetails] = useState(true);

  /* -------------------- fetch ------------------- */
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [cRes, fRes, sRes] = await Promise.all([
        axiosInstance.get(API_PATHS.COURSE.ALL_ACTIVE_COURSES),
        axiosInstance.get(API_PATHS.ADMIN.ALL_FACULTY_USER),
        axiosInstance.get(API_PATHS.ADMIN.ALL_STUDENT_USER),
      ]);
      setCourses(cRes.data.map(co => ({
        ...co,
        facultyCount: co.faculties?.length || 0,
        studentCount: co.students?.length || 0,
      })));
      setFaculties(fRes.data);
      setStudents(sRes.data);
      setError(null);
    } catch (e) {
      console.error(e); setError('Failed to fetch data.');
    } finally { setLoading(false); }
  };

  /* ---------- on course select fetch pivots ----- */
  const handleSelectCourse = async (course) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.COURSE.GET_COURSE_BY_ID(course.id));

      const facIds = data.faculties.map(cf => cf.faculty_id);
      const map = {};
      data.students.forEach(cs => {
        if (!map[cs.faculty_id]) map[cs.faculty_id] = [];
        map[cs.faculty_id].push(cs.student_id);
      });

      setSelectedCourse(course);
      setSelectedFaculties(facIds);
      setStudentsByFaculty(map);
      setChosenFaculty(null);
      setSelectedStudents([]);
      setActiveTab('faculty');
      setShowDetails(true);
      setError(null);
    } catch (e) {
      console.error(e); setError('Could not load course details.');
    } finally { setLoading(false); }
  };

  /* ---------------- faculty radio change -------- */
  const handleFacultyChange = (fid) => {
    setChosenFaculty(fid);
    setSelectedStudents(studentsByFaculty[fid] || []);
  };

  /* -------------- toggle helpers ---------------- */
  const toggle = setter => id => setter(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  const toggleFaculty = toggle(setSelectedFaculties);
  const toggleStudent = toggle(setSelectedStudents);

  /* ---------------- save handlers --------------- */
  const saveFaculties = async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      await axiosInstance.post(API_PATHS.FACULTY.ASSIGN_FACULTY(selectedCourse.id), { facultyIds: selectedFaculties });
      setNotice({type:'success',message:'Faculty assignments saved.'});
      bumpCounts();
    } catch(e){console.error(e);setError('Faculty assignment failed.');}
    finally{setLoading(false);} };

  const saveStudents = async () => {
    if (!selectedCourse || !chosenFaculty){setError('Select a faculty first.');return;}
    try {
      setLoading(true);
      await axiosInstance.post(API_PATHS.STUDENT.ASSIGN_STUDENT(selectedCourse.id), { facultyId: chosenFaculty, studentIds: selectedStudents });
      setNotice({type:'success',message:'Student enrollments saved.'});
      bumpCounts();
      setStudentsByFaculty(prev=>({...prev,[chosenFaculty]:selectedStudents}));
    }catch(e){console.error(e);setError('Student enrollment failed.');}
    finally{setLoading(false);} };

  const bumpCounts = () => {
    setCourses(prev=>prev.map(c=>c.id===selectedCourse.id?{...c,facultyCount:selectedFaculties.length,studentCount:Object.values(studentsByFaculty).reduce((acc,v)=>acc+v.length,0)}:c));
    setTimeout(()=>setNotice(null),3000);
  };

  /* ------------- derived ------------- */
  const facultyOpts = selectedFaculties.map(fid=>faculties.find(f=>f.id===fid)).filter(Boolean);

  /* ---------------- render ---------------- */
  return (
    <DashboardLayout>
      <div className="container mx-auto p-2">
        <h1 className="mb-6 text-2xl font-bold">Course Management</h1>

        <NotificationBanner notification={notice} error={error} onClose={()=>setNotice(null)} onClearError={()=>setError(null)}/>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="rounded bg-white p-6 shadow">
            <CourseList courses={courses} selectedCourse={selectedCourse} onSelectCourse={handleSelectCourse} isLoading={loading} onRefresh={fetchAll}/>
          </div>

          <div className="lg:col-span-1 xl:col-span-2 flex flex-col space-y-6">
            {selectedCourse ? (
              <>
                <CourseDetails course={selectedCourse} isExpanded={showDetails} onToggleExpand={()=>setShowDetails(p=>!p)} />

                <div className="flex space-x-6 border-b">
                  {['faculty','student'].map(t=>(
                    <button key={t} onClick={()=>setActiveTab(t)} className={`pb-2 text-sm font-medium ${activeTab===t?'border-b-2 border-blue-600 text-blue-600':'text-gray-500'}`}>{t==='faculty'?'Faculty':'Students'}</button>
                  ))}
                </div>

                {activeTab==='faculty' ? (
                  <FacultyTab faculties={faculties} selectedFaculties={selectedFaculties} onToggleFaculty={toggleFaculty} onSave={saveFaculties} selectedCourse={selectedCourse} isLoading={loading}/>
                ) : (
                  <StudentTab students={students} selectedStudents={selectedStudents} onToggleStudent={toggleStudent} onSave={saveStudents} selectedCourse={selectedCourse} isLoading={loading} facultyOptions={facultyOpts} chosenFaculty={chosenFaculty} onFacultyChange={handleFacultyChange}/>
                )}
              </>
            ) : <EmptyState icon={<Info size={48} className="text-gray-400"/>} title="No Course Selected" description="Choose a course first."/>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
