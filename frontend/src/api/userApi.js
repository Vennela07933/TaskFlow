import axiosInstance from './axiosInstance';

export const getAllUsersApi = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};
