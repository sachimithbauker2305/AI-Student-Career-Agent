import apiClient from './apiClient';

export const authService = {
  async register(userData) {
    const res = await apiClient.post('/api/auth/register', userData);
    if (res.data.access_token) {
      localStorage.setItem('career_auth_token', res.data.access_token);
      localStorage.setItem('career_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await apiClient.post('/api/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem('career_auth_token', res.data.access_token);
      localStorage.setItem('career_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async forgotPassword(email) {
    const res = await apiClient.post('/api/auth/forgot-password', { email });
    return res.data;
  },

  async verifyOtp(email, otp_code) {
    const res = await apiClient.post('/api/auth/verify-otp', { email, otp_code });
    return res.data;
  },

  async resetPassword(email, otp_code, new_password) {
    const res = await apiClient.post('/api/auth/reset-password', { email, otp_code, new_password });
    return res.data;
  },

  async changePassword(email, current_password, new_password, confirm_password) {
    try {
      const res = await apiClient.post('/api/auth/change-password', {
        email,
        current_password,
        new_password,
        confirm_password,
      });
      return res.data;
    } catch (err) {
      return {
        status: 'error',
        detail: err.response?.data?.detail || 'Unable to change password right now.'
      };
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('career_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return { first_name: 'Name', last_name: '', email: 'name@gmail.com' };
      }
    }
    return { first_name: 'Name', last_name: '', email: 'name@gmail.com' };
  },

  logout() {
    localStorage.removeItem('career_auth_token');
    localStorage.removeItem('career_user');
  }
};
