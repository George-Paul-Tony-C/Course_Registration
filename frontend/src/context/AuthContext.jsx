import {
  createContext, useCallback, useEffect, useRef, useState
} from 'react';
import { jwtDecode }   from 'jwt-decode';
import axiosInstance   from '../utils/axiosInstance';
import { toast }       from 'react-toastify';
import { API_PATHS }   from '../utils/api_paths';

export const AuthCtx = createContext(null);

/* helper – safe decode ------------------------------------------------ */
const decode = (tok) => { try { return jwtDecode(tok); } catch { return null; } };

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user , setUser ] = useState(null);
  const [ready, setReady] = useState(false);

  /* one timer per token ------------------------------------------------ */
  const logoutTimer = useRef(null);
  const clearTimer  = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = null;
  };

  /* put token into state + axios + LS + timer ------------------------- */
  const bootstrap = useCallback((tok) => {
    if (!tok) return;

    /* 1. decode ------------------------------------------------------- */
    const payload = decode(tok);
    setToken(tok);
    setUser(payload);

    /* 2. update axios default header --------------------------------- */
    axiosInstance.setToken(tok);

    /* 3. persist to localStorage ------------------------------------- */
    localStorage.setItem('lmsAccess', tok);

    /* 4. schedule auto-logout 5 s before expiry ---------------------- */
    clearTimer();
    const msTillExp = payload.exp * 1000 - Date.now() - 5000; // 5 s buffer
    if (msTillExp > 0) {
      logoutTimer.current = setTimeout(() => {
        toast.warn('Session expired – please log in again.');
        logout();                       // will navigate via <RoleRoute>
      }, msTillExp);
    }
  }, []);

  /* initial page load -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem('lmsAccess');
      if (saved) {
        bootstrap(saved);
        return setReady(true);
      }
      /* no saved token → try cookie refresh once --------------------- */
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.REFRESH);
        bootstrap(data.accessToken);
      } catch { /* ignore 401 on first run */ }
      finally { setReady(true); }
    })();
  }, [bootstrap]);

  /* public API --------------------------------------------------------- */
  const login = async (form) => {
    const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, form);
    bootstrap(data.accessToken);
    return decode(data.accessToken).role;
  };

  const signup = async (form) => {
    const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, form);
    bootstrap(data.accessToken);
    return decode(data.accessToken).role;
  };

  const logout = async () => {
    clearTimer();
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT).catch(() => {});
    localStorage.removeItem('lmsAccess');
    setToken(null); setUser(null);
  };

  /* clean up on unmount ---------------------------------------------- */
  useEffect(() => () => clearTimer(), []);

  return (
    <AuthCtx.Provider
      value={{ user, token, loggedIn: !!token, ready, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
