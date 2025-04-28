import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/api_paths';          // { AUTH: { LOGIN … } }

export const AuthCtx = createContext(null);

/* helper – safe decode */
const decode = (tok) => { try { return jwtDecode(tok); } catch { return null; } };

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user,  setUser ] = useState(null);
  const [ready, setReady] = useState(false);

  const bootedRef = useRef(false);         // mount interceptors once

  /* ------------------------------------------------------------------ */
  const bootstrap = useCallback((tok) => {
    if (!tok) return;
    setToken(tok);
    setUser(decode(tok));
    localStorage.setItem('lmsAccess', tok);
  }, []);

  /* -------------------- axios response-interceptor ------------------- */
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    const resId = axiosInstance.interceptors.response.use(
      (r) => r,
      async (err) => {
        const { response, config } = err;
        const shouldRefresh =
          response?.status === 401 &&
          !config._retry &&
          !config.url.includes(API_PATHS.AUTH.REFRESH);

        if (!shouldRefresh) return Promise.reject(err);

        config._retry = true;
        try {
          const { data } = await axiosInstance.get(API_PATHS.AUTH.REFRESH);
          bootstrap(data.accessToken);
          config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(config);          // replay original
        } catch (e) {
          localStorage.removeItem('lmsAccess');  // hard logout
          setToken(null); setUser(null);
          return Promise.reject(e);
        }
      }
    );

    return () => axiosInstance.interceptors.response.eject(resId);
  }, [bootstrap]);

  /* ----------------------- initial page load ------------------------- */
  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem('lmsAccess');
      if (saved) {
        bootstrap(saved);
        return setReady(true);
      }

      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.REFRESH);
        bootstrap(data.accessToken);
      } catch { /* first run without cookie → ignore 401 */ }
      finally { setReady(true); }
    })();
  }, [bootstrap]);

  /* -------------------------- public API ----------------------------- */
  const login  = async (form) => {
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
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT).catch(() => {});
    localStorage.removeItem('lmsAccess');
    setToken(null); setUser(null);
  };

  /* ------------------------------------------------------------------ */
  return (
    <AuthCtx.Provider
      value={{ user, token, loggedIn: !!token, ready, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
