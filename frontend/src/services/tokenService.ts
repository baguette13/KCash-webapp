import axios from 'axios';


class TokenService {
  getRefreshToken() {
    return sessionStorage.getItem('refresh_token');
  }


  getAccessToken() {
    return sessionStorage.getItem('access_token');
  }

 
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        'http://localhost:8000/api/auth/token/refresh/',
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.access) {
        sessionStorage.setItem('access_token', response.data.access);
        return true;
      } 
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.setItem('sessionExpired', 'true');
      return false;
    }
  }


  isTokenExpiringSoon() {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = expiryTime - currentTime;
      
      return timeRemaining < 5 * 60 * 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }
  

  getTokenInfo() {
    const token = this.getAccessToken();
    if (!token) return { valid: false, message: "Brak tokena" };
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; 
      const currentTime = Date.now();
      const timeRemaining = expiryTime - currentTime;
      
      const expiryDate = new Date(expiryTime);
      const expiryFormatted = expiryDate.toLocaleTimeString('pl-PL');
      
      const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
      const secondsRemaining = Math.floor((timeRemaining % (60 * 1000)) / 1000);
      
      return {
        valid: timeRemaining > 0,
        expiryTime: expiryFormatted,
        timeRemaining: `${minutesRemaining}m ${secondsRemaining}s`,
        rawData: payload,
        willRefreshSoon: this.isTokenExpiringSoon()
      };
    } catch (error) {
      return { valid: false, message: "Błąd dekodowania tokena" };
    }
  }
}

export default new TokenService();
