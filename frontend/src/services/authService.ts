
class AuthService {
 
  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('is_staff');
    
    window.location.href = '/login';
  }
  

  isAuthenticated() {
    return sessionStorage.getItem('access_token') !== null;
  }
}

export default new AuthService();
