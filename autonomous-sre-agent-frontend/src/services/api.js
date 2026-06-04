import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const logService = {
  // Fetch all analyzed logs
  getAllLogs: async () => {
    // We return the full response object because your Dashboard.jsx 
    // calls 'response.data'
    const response = await api.get('/logs');
    return response; 
  },

  // Fetch a specific log by ID for the Details page
  getLogById: async (id) => {
    const response = await api.get(`/logs/${id}`);
    return response;
  }
};

export default api;