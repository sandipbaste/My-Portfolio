import axios from 'axios';

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get user IP
const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return null;
  }
};

export const chatAPI = {
  sendMessage: async (message, sessionId = null) => {
    const userIP = await getUserIP();
    
    const payload = {
      message: message,
      session_id: sessionId,
      user_ip: userIP
    };
    
    const response = await api.post('/chat', payload);
    return response.data;
  },
};

export const contactAPI = {
  submitForm: async (formData) => {
    const userIP = await getUserIP();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      user_ip: userIP
    };
    
    const response = await api.post('/contact', payload);
    return response.data;
  },
};

export default api;