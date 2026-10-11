import axiosInstance from './axiosInstance';

export const getUserProjectsApi = async () => {
  const response = await axiosInstance.get('/projects');
  return response.data;
};

export const getProjectByIdApi = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

export const createProjectApi = async (name, description) => {
  const response = await axiosInstance.post('/projects', { name, description });
  return response.data;
};

export const addMemberApi = async (projectId, email) => {
  const response = await axiosInstance.post(`/projects/${projectId}/members`, { email });
  return response.data;
};
