import axiosInstance from './axiosInstance';

export const getProjectMessagesApi = async (projectId) => {
  const response = await axiosInstance.get(`/chats/project/${projectId}`);
  return response.data;
};

export const sendMessageApi = async (projectId, message) => {
  const response = await axiosInstance.post(`/chats/project/${projectId}`, { message });
  return response.data;
};
