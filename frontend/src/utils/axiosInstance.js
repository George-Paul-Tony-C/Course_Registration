// src/utils/axiosInstance.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_PATHS } from './api_paths';

/* ------------------------------------------------------------------ */
/* basic instance                                                     */
/* ------------------------------------------------------------------ */
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // dev fallback
  withCredentials: true,                          // send refresh cookie
  headers: { 'Content-Type': 'application/json' }
});

/* ------------------------------------------------------------------ */
/* tiny local helpers                                                 */
/* ------------------------------------------------------------------ */
const getToken = () => localStorage.getItem('lmsAccess');

const setToken = (tok) => {
  if (tok) {
    localStorage.setItem('lmsAccess', tok);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${tok}`;
  } else {
    localStorage.removeItem('lmsAccess');
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

/* ------------------------------------------------------------------ */
/* request-interceptor – attach token                                 */
/* ------------------------------------------------------------------ */
axiosInstance.interceptors.request.use((cfg) => {
  const tok = getToken();
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
});

/* ------------------------------------------------------------------ */
/* response-interceptor – single-flight refresh                       */
/* ------------------------------------------------------------------ */
let isRefreshing = false;
let queuedRequests = [];

const queue    = (cb)            => queuedRequests.push(cb);
const runQueue = (err, newTok) => {
  queuedRequests.forEach((cb) => cb(err, newTok));
  queuedRequests = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,                                        // happy path
  async (err) => {
    const { config, response } = err;

    const shouldRefresh =
      response?.status === 401 &&
      !config._retry &&
      !config.url.includes(API_PATHS.AUTH.REFRESH) &&
      !config.url.includes(API_PATHS.AUTH.LOGIN)   &&
      !config.url.includes(API_PATHS.AUTH.REGISTER);

    if (!shouldRefresh) return Promise.reject(err);
    config._retry = true;

    /* another request is already refreshing ------------------------ */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue((e, newTok) => {
          if (e) return reject(e);
          config.headers.Authorization = `Bearer ${newTok}`;
          resolve(axiosInstance(config));
        });
      });
    }

    /* we are the first to notice the 401 --------------------------- */
    isRefreshing = true;
    try {
      const { data }  = await axiosInstance.get(API_PATHS.AUTH.REFRESH);
      const newTok    = data.accessToken;

      setToken(newTok);               // persist + header default
      runQueue(null, newTok);         // wake waiting calls

      config.headers.Authorization = `Bearer ${newTok}`;
      return axiosInstance(config);   // replay original
    } catch (refreshErr) {
      /* ---- refresh failed: hard logout + UX feedback ------------ */
      setToken(null);
      runQueue(refreshErr, null);

      toast.error('Session expired. Please log in again.');
      window.location.replace('/login');   // immediate redirect

      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

/* ------------------------------------------------------------------ */
/* exports                                                            */
/* ------------------------------------------------------------------ */
axiosInstance.setToken = setToken;
axiosInstance.getToken = getToken;

export default axiosInstance;
