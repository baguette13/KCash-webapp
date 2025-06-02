import axios from 'axios';
import tokenService from './tokenService';

export const api = axios.create({
  baseURL: 'http://localhost:8000/'
});

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];
let sessionExpirationHandled = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

const handleSessionExpiration = (useDialog: boolean = false) => {
  if (sessionExpirationHandled) return;
  
  sessionExpirationHandled = true;
  
  sessionStorage.setItem('sessionExpired', 'true');
  
  if (useDialog) {
    sessionStorage.setItem('sessionExpiredSource', 'dialog');
  }
  
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  
  setTimeout(() => {
    window.location.href = '/login';
    
    setTimeout(() => {
      sessionExpirationHandled = false;
    }, 1000);
  }, 100);
};

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshSuccess = await tokenService.refreshToken();
        
        if (refreshSuccess) {
          const newToken = tokenService.getAccessToken();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          processQueue(error, null);
          isRefreshing = false;
          
          handleSessionExpiration(true);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        handleSessionExpiration(true);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async config => {
    if (tokenService.isTokenExpiringSoon() && !isRefreshing) {
      isRefreshing = true;
      const refreshSuccess = await tokenService.refreshToken();
      isRefreshing = false;
      
      if (!refreshSuccess) {
        if (!window.location.href.includes('/login')) {
          sessionStorage.setItem('sessionExpired', 'true');
          window.location.href = '/login';
        }
      }
    }
    
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
