import axiosInstance from './axiosInstance';

export const getAllTasksApi = async (status = '', search = '') => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await axiosInstance.get(`/tasks?${params.toString()}`);
  return response.data;
};

export const getProjectTasksApi = async (projectId) => {
  const response = await axiosInstance.get(`/tasks/project/${projectId}`);
  return response.data;
};

export const getTaskByIdApi = async (id) => {
  const response = await axiosInstance.get(`/tasks/${id}`);
  return response.data;
};

export const createTaskApi = async (taskData) => {
  const response = await axiosInstance.post('/tasks', taskData);
  return response.data;
};

export const updateTaskApi = async (id, taskData) => {
  const response = await axiosInstance.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const updateTaskStatusApi = async (id, status) => {
  const response = await axiosInstance.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTaskApi = async (id) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};
