import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default {
  async request(method, endpoint, data = null, token = null) {
    try {
      let response;
      const headers = {
        Accept: 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`; // Use backticks for template literal
      }

      switch (method.toLowerCase()) {
        case 'get':
          response = await axios.get(`${API_BASE_URL}${endpoint}`, { params: data, headers });
          break; 
        case 'post':
          response = await axios.post(`${API_BASE_URL}${endpoint}`, data, { headers });
          break; 
        case 'put':
          response = await axios.put(`${API_BASE_URL}${endpoint}`, data, { headers });
          break; 
        case 'delete':
          response = await axios.delete(`${API_BASE_URL}${endpoint}`, { headers });
          break; 
        default:
          throw new Error(`Invalid HTTP method: ${method}`);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status <= 500) {
          return error.response.data;
        }
      }
      throw error;
    }
  },
};
