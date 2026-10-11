import axiosInstance from './axiosInstance';

export const loginApi = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (name, email, password) => {
  const response = await axiosInstance.post('/auth/register', { name, email, password });
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
