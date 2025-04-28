import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import RoleRoute    from './context/RoleRoute';
import LoginPage    from './Pages/Auth/LoginPage';
import SignUpPage   from './Pages/Auth/SignUpPage';
import AdminDashboard from './Pages/Admin/SampleAdmin';
import FacultyDashboard from './Pages/Faculty/SampleFaculty';
import StudentDashboard from './Pages/Student/SampleStudent';



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<RoleRoute allow={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<RoleRoute allow={['FACULTY']} />}>
            <Route path="/faculty" element={<FacultyDashboard />} />
          </Route>

          <Route element={<RoleRoute allow={['STUDENT']} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
