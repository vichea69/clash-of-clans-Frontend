import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBases = async () => {
  try {
    const response = await axios.get(`${API_URL}/bases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bases:', error);
    throw error;
  }
}; 