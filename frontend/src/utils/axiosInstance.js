// src/utils/axiosInstance.js
import axios from 'axios';
import { API_PATHS } from './api_paths';

/* ------------------------------------------------------------- */
/* config                                                        */
/* ------------------------------------------------------------- */
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',   // <- ONE “/api”, not two
  withCredentials: true,                  // <- send HttpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' }
});

/* ------------------------------------------------------------- */
/* helpers                                                       */
/* ------------------------------------------------------------- */
const getToken = () => localStorage.getItem('lmsAccess');      // or 'lmsAuth'
const setToken = (tok) => tok
  ? localStorage.setItem('lmsAccess', tok)
  : localStorage.removeItem('lmsAccess');

/* ------------------------------------------------------------- */
/* request interceptor                                           */
/* ------------------------------------------------------------- */
axiosInstance.interceptors.request.use((config) => {
  const tok = getToken();
  if (tok) config.headers.Authorization = `Bearer ${tok}`;
  return config;
});

/* ------------------------------------------------------------- */
/* response interceptor with single-flight refresh logic         */
/* ------------------------------------------------------------- */
let isRefreshing   = false;
let queuedRequests = [];          // callers waiting for new token

const queue = (cb) => queuedRequests.push(cb);
const runQueue = (err, newTok) => {
  queuedRequests.forEach((cb) => cb(err, newTok));
  queuedRequests = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,                                   // happy path
  async (err) => {
    const { config, response } = err;

    // Only react to 401s that are NOT from /auth/refresh (or login/register)
    const shouldRefresh =
      response?.status === 401 &&
      !config._retry &&
      !config.url.includes(API_PATHS.AUTH.REFRESH) &&
      !config.url.includes(API_PATHS.AUTH.LOGIN) &&
      !config.url.includes(API_PATHS.AUTH.REGISTER);

    if (!shouldRefresh) return Promise.reject(err);
    config._retry = true;

    // ---------- a refresh is already in flight ----------
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue((e, tok) => {
          if (e) return reject(e);
          config.headers.Authorization = `Bearer ${tok}`;
          resolve(axiosInstance(config));
        });
      });
    }

    // ---------- we are the first to notice the 401 ----------
    isRefreshing = true;
    try {
      const { data } = await axiosInstance.get(API_PATHS.AUTH.REFRESH);  // uses cookie
      const newTok = data.accessToken;
      setToken(newTok);
      runQueue(null, newTok);

      // replay the original request
      config.headers.Authorization = `Bearer ${newTok}`;
      return axiosInstance(config);
    } catch (refreshErr) {
      setToken(null);                       // dump the bad access token
      runQueue(refreshErr, null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
