import axios from 'axios';

const API_URL = 'http://172.20.10.2:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (email: string, name: string, password: string) => {
  const response = await apiClient.post('/auth/signup', { email, name, password });
  return response.data;
};

export default apiClient;
