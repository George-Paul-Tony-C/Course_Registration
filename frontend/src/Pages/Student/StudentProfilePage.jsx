import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { AuthCtx } from '../../context/AuthContext';
import { API_PATHS } from '../../utils/api_paths';
import { 
  Loader2, 
  KeyRound, 
  User, 
  Mail, 
  Calendar, 
  BookOpen,
  Clock, 
  X, 
  AlertCircle,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Users,
  Trophy,
  GraduationCap,
  MapPin,
  Phone,
  FileText,
  BriefcaseBusiness,
  Medal,
  Bookmark,
  BarChart3,
  PieChart,
  Percent,
  Globe,
  Award,
  BookCopy
} from 'lucide-react';
import StudentDashboardLayout from '../../components/Layouts/student/StudentDashboardLayout';
import BackButton from '../../components/BackButton';

/* utility functions */
const prettify = s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
const fmtDate = iso => new Date(iso).toLocaleString();

/* main component */
export default function StudentProfilePage() {
  const { user } = useContext(AuthCtx);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pwdDialog, setPwdDialog] = useState(false);
  const [pwd, setPwd] = useState({ old: '', pass: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showPassword, setShowPassword] = useState({old: false, pass: false, confirm: false});
  const [activeTab, setActiveTab] = useState('profile');

  /* fetch profile */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.ME);
        setInfo(data);
      } catch (e) {
        showToast('Failed to load profile', 'error');
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const handleChangePassword = async () => {
    if (pwd.pass !== pwd.confirm) return showToast('Passwords do not match', 'error');
    try {
      setBusy(true);
      await axiosInstance.put(API_PATHS.AUTH.PASSWORD, { oldPassword: pwd.old, newPassword: pwd.pass });
      showToast('Password updated successfully');
      setPwd({ old: '', pass: '', confirm: '' });
      setTimeout(() => setPwdDialog(false), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Password update failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}));
  };

  if (!user || user.role !== 'STUDENT') return <AccessDenied />;
  if (loading) return <LoadingScreen />;

  const profile = info.user;
  
  // Sample student-specific data
  const studentData = {
    studentId: "ST20241089",
    department: "Computer Science",
    level: "Undergraduate",
    year: "3rd Year",
    program: "Bachelor of Science in Computer Science",
    advisor: "Dr. Sarah Johnson",
    enrollmentDate: "2022-09-01",
    expectedGraduation: "2026-05-15",
    residentialAddress: "123 College Park Lane, Apt 45B",
    permanentAddress: "789 Oak Street, Springfield, IL",
    phone: "+1 (555) 987-6543",
    emergency: {
      name: "Robert Smith",
      relation: "Father", 
      phone: "+1 (555) 456-7890"
    },
    courses: [
      { id: 1, code: "CS301", name: "Database Systems", instructor: "Dr. Jane Miller", credits: 3, grade: "A", status: "In Progress" },
      { id: 2, code: "CS345", name: "Operating Systems", instructor: "Prof. Michael Chen", credits: 4, grade: "B+", status: "In Progress" },
      { id: 3, code: "MATH252", name: "Discrete Mathematics", instructor: "Dr. Robert Taylor", credits: 3, grade: "A-", status: "In Progress" },
      { id: 4, code: "CS290", name: "Software Engineering", instructor: "Dr. Emily Wilson", credits: 4, grade: "B", status: "In Progress" },
      { id: 5, code: "CS201", name: "Data Structures", instructor: "Prof. James Brown", credits: 4, grade: "A", status: "Completed" },
      { id: 6, code: "CS101", name: "Intro to Programming", instructor: "Dr. Lisa Garcia", credits: 3, grade: "A+", status: "Completed" }
    ],
    academicRecord: {
      gpa: 3.8,
      totalCredits: 58,
      requiredCredits: 120,
      standingStatus: "Good Standing",
      honors: ["Dean's List Fall 2022", "Dean's List Spring 2023", "Academic Excellence Scholarship"]
    },
    attendance: {
      overall: 92,
      courses: {
        "CS301": 95,
        "CS345": 88,
        "MATH252": 94,
        "CS290": 91
      }
    },
    academicCalendar: [
      { event: "Midterm Exams", date: "2025-03-10" },
      { event: "Spring Break", date: "2025-03-15" },
      { event: "Course Registration", date: "2025-04-05" },
      { event: "Final Exams", date: "2025-05-10" }
    ],
    extracurricular: [
      { activity: "Coding Club", role: "Vice President", period: "2023-Present" },
      { activity: "Hackathon Team", role: "Team Lead", period: "2023-Present" },
      { activity: "Student Council", role: "Technology Representative", period: "2024-Present" }
    ],
    documents: [
      { type: "Transcript", date: "2025-01-15", status: "Available" },
      { type: "Enrollment Verification", date: "2025-01-20", status: "Available" },
      { type: "Financial Aid Statement", date: "2025-01-10", status: "Available" }
    ]
  };

  const completedCredits = studentData.academicRecord.totalCredits;
  const totalRequiredCredits = studentData.academicRecord.requiredCredits;
  const completionPercentage = Math.round((completedCredits / totalRequiredCredits) * 100);
  
  const activeCourses = studentData.courses.filter(course => course.status === 'In Progress');
  const completedCourses = studentData.courses.filter(course => course.status === 'Completed');

  return (
    <StudentDashboardLayout>
      {toast.show && <Toast {...toast} />}

      <div className="max-w-7xl mx-auto p-1">
        <BackButton />  
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>
          <p className="text-gray-500 mt-2">Manage your personal information, courses, and academic progress</p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left sidebar with user info */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-600 py-6 px-6 text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white p-2 mb-2">
                  <User size={64} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-white mt-2">{profile.username}</h2>
                <p className="text-blue-100 text-sm mt-1">{studentData.program}</p>
                <div className="flex items-center justify-center gap-1 text-blue-100 mt-2">
                  <Mail size={14} />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="py-2 px-4 bg-blue-50 rounded-lg inline-flex items-center w-full">
                  <Bookmark className="text-blue-600 mr-2" size={16} />
                  <span className="text-sm font-medium text-blue-700">ID: {studentData.studentId}</span>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <GraduationCap size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-700">{studentData.department}, {studentData.level}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <MapPin size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-700">{studentData.residentialAddress}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <Phone size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-700">{studentData.phone}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setPwdDialog(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <KeyRound size={16} />
                  Change Password
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="mt-6 space-y-4">
              <StatCard 
                title="Current GPA" 
                value={studentData.academicRecord.gpa.toFixed(2)} 
                icon={<Trophy size={20} className="text-amber-500" />} 
                color="amber"
              />
              <StatCard 
                title="Completion" 
                value={`${completionPercentage}%`} 
                icon={<Percent size={20} className="text-emerald-500" />} 
                color="emerald"
              />
              <StatCard 
                title="Active Courses" 
                value={activeCourses.length} 
                icon={<BookOpen size={20} className="text-blue-500" />} 
                color="blue"
              />
              <StatCard 
                title="Attendance" 
                value={`${studentData.attendance.overall}%`} 
                icon={<Clock size={20} className="text-purple-500" />} 
                color="purple"
              />
            </div>

            {/* Academic Progress */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Degree Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{completedCredits} credits completed</span>
                <span>{totalRequiredCredits} required</span>
              </div>
            </div>
          </div>
          
          {/* Main content area - profile tabs */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                {[
                  { id: 'profile', label: 'Profile Details' },
                  { id: 'academics', label: 'Academics' },
                  { id: 'courses', label: 'Courses & Grades' },
                  { id: 'activities', label: 'Activities & Documents' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`mr-8 py-4 px-1 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <Settings size={16} />
                    Edit Profile
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {Object.entries(profile)
                    .filter(([k]) => !['id', 'role', 'is_deleted'].includes(k))
                    .map(([k, v]) => (
                      <ProfileField 
                        key={k} 
                        label={prettify(k)} 
                        value={k.endsWith('_at') ? fmtDate(v) : v.toString()} 
                      />
                    ))}
                  
                  <ProfileField label="Student ID" value={studentData.studentId} />
                  <ProfileField label="Department" value={studentData.department} />
                  <ProfileField label="Program" value={studentData.program} />
                  <ProfileField label="Year" value={studentData.year} />
                  <ProfileField label="Advisor" value={studentData.advisor} />
                  <ProfileField label="Enrollment Date" value={fmtDate(studentData.enrollmentDate).split(',')[0]} />
                  <ProfileField label="Expected Graduation" value={fmtDate(studentData.expectedGraduation).split(',')[0]} />
                  <ProfileField label="Phone" value={studentData.phone} />
                </div>
                
                {/* Address Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Residential Address</h4>
                      <p className="text-gray-700">{studentData.residentialAddress}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Permanent Address</h4>
                      <p className="text-gray-700">{studentData.permanentAddress}</p>
                    </div>
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Emergency Contact</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ProfileField label="Name" value={studentData.emergency.name} />
                      <ProfileField label="Relationship" value={studentData.emergency.relation} />
                      <ProfileField label="Phone" value={studentData.emergency.phone} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Academics Tab */}
            {activeTab === 'academics' && (
              <div className="space-y-6">
                {/* Academic Summary Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Academic Summary</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-blue-100 p-3 mb-2">
                          <PieChart size={24} className="text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-blue-800">Current GPA</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{studentData.academicRecord.gpa.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-emerald-50 p-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-emerald-100 p-3 mb-2">
                          <BookCopy size={24} className="text-emerald-600" />
                        </div>
                        <p className="text-sm font-medium text-emerald-800">Credits Completed</p>
                        <p className="text-3xl font-bold text-emerald-900 mt-1">{studentData.academicRecord.totalCredits}</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-purple-50 p-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-purple-100 p-3 mb-2">
                          <Award size={24} className="text-purple-600" />
                        </div>
                        <p className="text-sm font-medium text-purple-800">Academic Standing</p>
                        <p className="text-md font-bold text-purple-900 mt-1">{studentData.academicRecord.standingStatus}</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-amber-50 p-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-amber-100 p-3 mb-2">
                          <GraduationCap size={24} className="text-amber-600" />
                        </div>
                        <p className="text-sm font-medium text-amber-800">Expected Graduation</p>
                        <p className="text-md font-bold text-amber-900 mt-1">{new Date(studentData.expectedGraduation).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Academic Progress and Attendance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Degree Progress</h3>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Progress toward degree</span>
                      <span className="text-lg font-semibold text-blue-600">{completionPercentage}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div 
                        className="bg-blue-600 h-4 rounded-full" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500">Credits Completed</p>
                        <p className="font-semibold text-gray-800">{completedCredits}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Credits Required</p>
                        <p className="font-semibold text-gray-800">{totalRequiredCredits}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-semibold text-gray-800">{totalRequiredCredits - completedCredits}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attendance */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Attendance Overview</h3>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Overall Attendance</span>
                      <span className="text-lg font-semibold text-blue-600">{studentData.attendance.overall}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div 
                        className={`h-4 rounded-full ${
                          studentData.attendance.overall >= 90 ? 'bg-emerald-500' : 
                          studentData.attendance.overall >= 80 ? 'bg-blue-500' : 
                          studentData.attendance.overall >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${studentData.attendance.overall}%` }}
                      ></div>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attendance by Course</h4>
                    <div className="space-y-3">
                      {Object.entries(studentData.attendance.courses).map(([course, percent]) => (
                        <div key={course} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{course}</span>
                            <span className={`font-medium ${
                              percent >= 90 ? 'text-emerald-600' : 
                              percent >= 80 ? 'text-blue-600' : 
                              percent >= 70 ? 'text-amber-600' : 'text-red-600'
                            }`}>{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                percent >= 90 ? 'bg-emerald-500' : 
                                percent >= 80 ? 'bg-blue-500' : 
                                percent >= 70 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Academic Honors and Upcoming Calendar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Honors */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Academic Honors</h3>
                    
                    <div className="space-y-4">
                      {studentData.academicRecord.honors.map((honor, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="mt-1">
                            <Medal size={16} className="text-amber-500" />
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{honor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Academic Calendar */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Upcoming Academic Calendar</h3>
                    
                    <div className="space-y-4">
                      {studentData.academicCalendar.map((event, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-gray-800">{event.event}</span>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Courses & Grades Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                {/* Active Courses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Current Courses</h2>
                    <div className="text-sm text-gray-500">Spring Semester 2025</div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeCourses.map(course => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{course.code}</div>
                              <div className="text-xs text-gray-500">{course.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.instructor}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.credits}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                course.grade?.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                                course.grade?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                course.grade?.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                                course.grade?.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                                course.grade?.startsWith('F') ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {course.grade || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Completed Courses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Completed Courses</h2>
                    <div className="text-sm text-gray-500">Previous Semesters</div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {completedCourses.map(course => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{course.code}</div>
                              <div className="text-xs text-gray-500">{course.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.instructor}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.credits}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                course.grade?.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                                course.grade?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                course.grade?.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                                course.grade?.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                                course.grade?.startsWith('F') ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {course.grade || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Activities & Documents Tab */}
            {activeTab === 'activities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracurricular Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Extracurricular Activities</h2>
                  
                  <div className="space-y-4">
                    {studentData.extracurricular.map((activity, idx) => (
                      <div key={idx} className="flex justify-between pb-3 border-b border-gray-100">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">{activity.activity}</h3>
                          <p className="text-xs text-gray-500">{activity.role}</p>
                        </div>
                        <div className="text-xs text-gray-500">{activity.period}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Documents */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Official Documents</h2>
                  
                  <div className="space-y-3">
                    {studentData.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText size={16} className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{doc.type}</p>
                            <p className="text-xs text-gray-500">Updated: {new Date(doc.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-200">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Password Change Dialog */}
      {pwdDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setPwdDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    value={pwd.old}
                    onChange={(e) => setPwd({...pwd, old: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.old ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.pass ? "text" : "password"}
                    value={pwd.pass}
                    onChange={(e) => setPwd({...pwd, pass: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    type="button"
                    onClick={() => togglePasswordVisibility('pass')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.pass ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={pwd.confirm}
                    onChange={(e) => setPwd({...pwd, confirm: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setPwdDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={busy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentDashboardLayout>
  );
}

/* Helper Components */
const ProfileField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
);

const StatCard = ({ title, value, icon, color }) => {
  const bgColor = `bg-${color}-50`;
  const textColor = `text-${color}-700`;
  
  return (
    <div className={`p-4 rounded-lg border border-gray-100 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className={`text-xl font-bold ${textColor} mt-1`}>{value}</p>
        </div>
        <div className={`p-2 rounded-full bg-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success' }) => {
  const bg = type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
  const text = type === 'success' ? 'text-emerald-600' : 'text-red-600';
  const icon = type === 'success' ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-red-500" />;
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-md border ${bg} flex items-center animate-fade-in`}>
      {icon}
      <span className={`ml-2 text-sm font-medium ${text}`}>{message}</span>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <Loader2 size={40} className="animate-spin mx-auto text-blue-600" />
      <p className="mt-4 text-gray-600">Loading profile...</p>
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center max-w-md p-8 bg-red-50 rounded-xl">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">You don't have permission to view this student profile.</p>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Go Back
      </button>
    </div>
  </div>
);