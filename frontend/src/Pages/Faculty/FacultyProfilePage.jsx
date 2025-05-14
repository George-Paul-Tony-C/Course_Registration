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
  Medal
} from 'lucide-react';
import FacultyDashboardLayout from '../../components/Layouts/faculty/FacultyDashboardLayout';
import BackButton from '../../components/BackButton';

/* utility functions */
const prettify = s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
const fmtDate = iso => new Date(iso).toLocaleString();

/* main component */
export default function FacultyProfilePage() {
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

  if (!user || user.role !== 'FACULTY') return <AccessDenied />;
  if (loading) return <LoadingScreen />;

  const profile = info.user;
  
  // Sample faculty-specific data
  const facultyData = {
    department: "Computer Science",
    position: "Associate Professor",
    office: "Room 302, Science Building",
    officeHours: "Mon, Wed 2:00 PM - 4:00 PM",
    phone: "+1 (555) 123-4567",
    specialization: "Machine Learning & Data Science",
    joinDate: "2019-09-01",
    courses: [
      { id: 1, code: "CS101", name: "Introduction to Programming", students: 45 },
      { id: 2, code: "CS202", name: "Data Structures", students: 38 },
      { id: 3, code: "CS405", name: "Advanced Database Systems", students: 27 },
      { id: 4, code: "CS541", name: "Machine Learning Fundamentals", students: 32 }
    ],
    education: [
      { degree: "Ph.D. in Computer Science", institution: "Stanford University", year: "2017" },
      { degree: "M.S. in Computer Science", institution: "University of Michigan", year: "2013" },
      { degree: "B.S. in Computer Engineering", institution: "Purdue University", year: "2011" }
    ],
    achievements: [
      { title: "Best Teacher Award", year: "2023" },
      { title: "Research Excellence Award", year: "2022" },
      { title: "Faculty Innovation Grant", year: "2021" }
    ]
  };

  const totalStudents = facultyData.courses.reduce((acc, course) => acc + course.students, 0);

  return (
    <FacultyDashboardLayout>
      {toast.show && <Toast {...toast} />}

      <div className="max-w-7xl mx-auto p-1">
        <BackButton />  
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Faculty Profile</h1>
          <p className="text-gray-500 mt-2">Manage your personal information, courses, and academic credentials</p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left sidebar with user info */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-indigo-600 py-6 px-6 text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white p-2 mb-2">
                  <User size={64} className="text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-white mt-2">Dr. {profile.username}</h2>
                <p className="text-indigo-100 text-sm mt-1">{facultyData.position}</p>
                <div className="flex items-center justify-center gap-1 text-indigo-100 mt-2">
                  <Mail size={14} />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="py-2 px-4 bg-indigo-50 rounded-lg inline-flex items-center w-full">
                  <GraduationCap className="text-indigo-600 mr-2" size={16} />
                  <span className="text-sm font-medium text-indigo-700">{facultyData.department}</span>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <MapPin size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-700">{facultyData.office}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <Phone size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-700">{facultyData.phone}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-700">{facultyData.officeHours}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setPwdDialog(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                >
                  <KeyRound size={16} />
                  Change Password
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="mt-6 space-y-4">
              <StatCard 
                title="Total Students" 
                value={totalStudents} 
                icon={<Users size={20} className="text-blue-500" />} 
                color="blue"
              />
              <StatCard 
                title="Courses" 
                value={`${facultyData.courses.length} active`} 
                icon={<BookOpen size={20} className="text-emerald-500" />} 
                color="emerald"
              />
              <StatCard 
                title="Experience" 
                value={`${new Date().getFullYear() - new Date(facultyData.joinDate).getFullYear()} years`} 
                icon={<BriefcaseBusiness size={20} className="text-purple-500" />} 
                color="purple"
              />
              <StatCard 
                title="Achievements" 
                value={`${facultyData.achievements.length} awards`} 
                icon={<Trophy size={20} className="text-amber-500" />} 
                color="amber"
              />
            </div>
          </div>
          
          {/* Main content area - profile tabs */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                {[
                  { id: 'profile', label: 'Profile Details' },
                  { id: 'courses', label: 'Courses' },
                  { id: 'education', label: 'Education & Achievements' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`mr-8 py-4 px-1 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
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
                  <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
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
                  
                  <ProfileField label="Department" value={facultyData.department} />
                  <ProfileField label="Position" value={facultyData.position} />
                  <ProfileField label="Office" value={facultyData.office} />
                  <ProfileField label="Office Hours" value={facultyData.officeHours} />
                  <ProfileField label="Phone" value={facultyData.phone} />
                  <ProfileField label="Specialization" value={facultyData.specialization} />
                  <ProfileField label="Join Date" value={fmtDate(facultyData.joinDate).split(',')[0]} />
                </div>
                
                {/* Academic Bio Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Academic Bio</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      Dr. {profile.username} is an {facultyData.position} in the {facultyData.department} department, 
                      specializing in {facultyData.specialization}. With {new Date().getFullYear() - new Date(facultyData.joinDate).getFullYear()} years 
                      of teaching experience, they have instructed over {totalStudents} students across various courses.
                      Their research interests include deep learning, natural language processing, and computer vision.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">My Courses</h2>
                  <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    <FileText size={16} />
                    Export Course List
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {facultyData.courses.map(course => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{course.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{course.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users size={16} className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{course.students}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-4">View Details</button>
                            <button className="text-indigo-600 hover:text-indigo-900">Grade</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Course Metrics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-700">Total Courses</p>
                        <p className="mt-1 text-2xl font-semibold text-indigo-900">{facultyData.courses.length}</p>
                      </div>
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <BookOpen size={20} className="text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Students</p>
                        <p className="mt-1 text-2xl font-semibold text-blue-900">{totalStudents}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Users size={20} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-700">Avg. Per Course</p>
                        <p className="mt-1 text-2xl font-semibold text-emerald-900">{Math.round(totalStudents / facultyData.courses.length)}</p>
                      </div>
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <Trophy size={20} className="text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Education & Achievements Tab */}
            {activeTab === 'education' && (
              <div className="space-y-8">
                {/* Education Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Education</h2>
                    <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      <Settings size={16} />
                      Manage
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {facultyData.education.map((edu, idx) => (
                      <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-2">
                        <h3 className="text-base font-medium text-gray-900">{edu.degree}</h3>
                        <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Calendar size={14} className="mr-1" />
                          <span>Class of {edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Achievements Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Awards & Achievements</h2>
                    <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      <Settings size={16} />
                      Manage
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {facultyData.achievements.map((achievement, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <Medal size={20} className="text-amber-500 mr-2" />
                          <h3 className="text-sm font-medium text-gray-900">{achievement.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600">Awarded in {achievement.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Research Interests */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Research Interests</h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {["Machine Learning", "Artificial Intelligence", "Data Mining", "Neural Networks", 
                      "Natural Language Processing", "Computer Vision", "Big Data Analytics"].map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                        {tag}
                      </span>  
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {pwdDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !busy && setPwdDialog(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              <button 
                onClick={() => !busy && setPwdDialog(false)}
                className="text-indigo-100 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {['old', 'pass', 'confirm'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'old' ? 'Current Password' : field === 'pass' ? 'New Password' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      value={pwd[field]}
                      onChange={(e) => setPwd({ ...pwd, [field]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => !busy && setPwdDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={busy}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/50 flex items-center"
                >
                  {busy ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FacultyDashboardLayout>
  );
}

/* Supporting Components */
const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
      <p className="text-gray-500">Loading profile data...</p>
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
    </div>
  </div>
);

const Toast = ({ message, type }) => (
  <div 
    className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg ${
      type === 'error' ? 'bg-red-600' : 'bg-green-600'
    }`}
  >
    {type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
    {message}
  </div>
);

const StatCard = ({ title, value, icon, color, onClick }) => {
  const colorClass = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700", 
    amber: "bg-amber-50 text-amber-700"
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`rounded-full p-2 ${colorClass[color] || colorClass.blue}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base text-gray-800">{value}</p>
  </div>
);

// Missing Check component in the imports - add it
const Check = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);