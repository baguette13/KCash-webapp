import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../services/axiosConfig';

interface ApiContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ApiContext = createContext<ApiContextType>({
  loading: false,
  setLoading: () => {},
});

export const useApiContext = () => useContext(ApiContext);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (!config.url?.includes('token/refresh')) {
          setPendingRequests((prev) => prev + 1);
          setLoading(true);
        }
        return config;
      },
      (error) => {
        setPendingRequests((prev) => Math.max(0, prev - 1));
        if (pendingRequests <= 1) {
          setLoading(false);
        }
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setPendingRequests((prev) => Math.max(0, prev - 1));
        if (pendingRequests <= 1) {
          setLoading(false);
        }
        return response;
      },
      (error) => {
        setPendingRequests((prev) => Math.max(0, prev - 1));
        if (pendingRequests <= 1) {
          setLoading(false);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [pendingRequests]);

  return (
    <ApiContext.Provider value={{ loading, setLoading }}>
      {children}
    </ApiContext.Provider>
  );
};
