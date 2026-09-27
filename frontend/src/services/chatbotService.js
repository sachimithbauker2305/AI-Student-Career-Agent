import apiClient from './apiClient';

export const chatbotService = {
  async sendMessage(message, history = []) {
    const res = await apiClient.post('/api/chatbot', {
      message,
      history,
    }, { timeout: 120000 });
    return res.data;
  },
};
