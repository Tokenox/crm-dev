import axios from 'axios';
import { urls } from '../../apiConfig';

const env = process.env.REACT_APP_STAGE || 'development';
export const baseURL = urls[env] || 'https://voltaiccrm-7dd827fb5012.herokuapp.com/rest';

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials: true
  // headers: {
  //   'Content-Type': 'application/json',
  //   Authorization: authToken
  // }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Modify the request config here (e.g., add headers, authentication tokens)
    const accessToken = localStorage.getItem('authToken');

    // ** If token is present add it to request's Authorization Header
    if (accessToken) {
      if (config.headers) config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);

export const { get, post, put, delete: destroy } = apiClient;
export default apiClient;
