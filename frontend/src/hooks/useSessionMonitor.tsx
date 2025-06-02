import { useEffect } from 'react';
import tokenService from '../services/tokenService';


const useSessionMonitor = () => {
  useEffect(() => {
    const checkTokenStatus = async () => {
      if (!tokenService.getAccessToken()) {
        return; 
      }
      
      try {
        if (tokenService.isTokenExpiringSoon()) {
          const refreshSuccessful = await tokenService.refreshToken();
          
          if (!refreshSuccessful) {
            sessionStorage.setItem('sessionExpired', 'true');
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error checking token status:', error);
      }
    };
    
    checkTokenStatus();
    
    const intervalId = setInterval(checkTokenStatus, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
};

export default useSessionMonitor;
