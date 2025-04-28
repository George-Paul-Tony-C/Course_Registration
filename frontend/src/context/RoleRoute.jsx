import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthCtx } from './AuthContext';

export default function RoleRoute({ allow = [] }) {
  const { ready, loggedIn, user } = useContext(AuthCtx);

  if (!ready) return null;                                   // still booting
  if (!loggedIn || !user) return <Navigate to="/login" replace />;

  return allow.includes(user.role)
    ? <Outlet />
    : <Navigate to={`/${user.role.toLowerCase()}`} replace />;
}
