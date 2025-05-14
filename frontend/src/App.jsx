import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { AuthCtx } from './context/AuthContext';
import RoleRoute    from './context/RoleRoute';
import LoginPage    from './Pages/Auth/LoginPage';
import SignUpPage   from './Pages/Auth/SignUpPage';
import SampleAdminDashboard from './Pages/Admin/SampleAdmin';
import SampleFacultyDashboard from './Pages/Faculty/SampleFaculty';
import SampleStudentDashboard from './Pages/Student/SampleStudent';
import AdminProfilePage from './Pages/Admin/AdminProfilePage';
import StudentListingPage from './Pages/Admin/StudentListingPage';
import FacultyListingPage from './Pages/Admin/FacultyListingPage';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseListingPage from './Pages/Admin/CourseListingPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AddStudentPage from './Pages/Admin/AddStudentPage';
import AddFacultyPage from './Pages/Admin/AddFacultyPage';
import AddCoursePage from './Pages/Admin/AddCoursePage';
import PendingCoursesPage from './Pages/Admin/PendingCoursesPage';
import ArchivedCoursesPage from './Pages/Admin/ArchivedCoursesPage';
import ActiveCoursesPage from './Pages/Admin/ActiveCoursesPage';
import CourseManagement from './Pages/Admin/CourseManagement';
import FacultyDashboard from './Pages/Faculty/FacultyDashboard';
import FacultyProfilePage from './Pages/Faculty/FacultyProfilePage';
import StudentProfilePage from './Pages/Student/StudentProfilePage';
import StudentDashboard from './Pages/Student/StudentDashboard';
import FacultyCourseListingPage from './Pages/Faculty/FacultyCourseListingPage';
import FacultyCourseDetailsPage from './Pages/Faculty/FacultyCourseDetailsPage';


const Root = () => {
  const { loggedIn, user } = useContext(AuthCtx);
  
  if (!loggedIn) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />

          <Route path="/login"  element={<LoginPage />} />
          {/* <Route path="/signup" element={<SignUpPage />} /> */}

          <Route element={<RoleRoute allow={['ADMIN']} />}>
            {/* <Route path="/admin" element={<SampleAdminDashboard />} /> */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />

            <Route path="/admin/students" element={<StudentListingPage />} />
            <Route path="/admin/students/new" element={<AddStudentPage />} />

            <Route path="/admin/faculties" element={<FacultyListingPage />} />
            <Route path="/admin/faculty/new" element={<AddFacultyPage />} />
            
            <Route path="/admin/courses" element={<CourseListingPage />} />
            <Route path="/admin/courses/new" element={<AddCoursePage />} />
            <Route path="/admin/courses/active" element={<ActiveCoursesPage />} />
            <Route path="/admin/courses/pending" element={<PendingCoursesPage />} />
            <Route path="/admin/courses/inactive" element={<ArchivedCoursesPage />} />

            <Route path="/admin/managing" element={<CourseManagement />} />

          </Route>

          <Route element={<RoleRoute allow={['FACULTY']} />}>
            {/* <Route path="/faculty" element={<SampleFacultyDashboard />} /> */}
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/profile" element={<FacultyProfilePage />} />
            <Route path="/faculty/courses" element={<FacultyCourseListingPage />} />
            <Route path="/faculty/courses/:courseId" element={<FacultyCourseDetailsPage />} />
          </Route>

          <Route element={<RoleRoute allow={['STUDENT']} />}>
            <Route path="/student" element={<SampleStudentDashboard />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>

          <Route path="*" element={<LoginPage />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={3500} />
      </BrowserRouter>
    </AuthProvider>
  );
}
