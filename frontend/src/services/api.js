import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatAPI = {
  sendMessage: async (message, sessionId = null) => {
    const response = await api.post('/chat', {
      message,
      session_id: sessionId
    });
    return response.data;
  }
};