import axiosInstance from './axiosInstance';

export const getDashboardSummaryApi = async () => {
  const response = await axiosInstance.get('/dashboard');
  return response.data;
};
