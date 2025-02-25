import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBases = async () => {
  try {
    const response = await axios.get(`${API_URL}/bases`);
    const { data } = response;
    
    console.log('API Response Data:', data);

    // Extract array data from common response patterns
    if (data && typeof data === 'object') {
      const possibleArrays = ['data', 'results', 'bases'];

      // Return the first valid array found in the response
      for (const key of possibleArrays) {
        if (data[key] && Array.isArray(data[key])) {
          console.log(`Found array in response.${key}:`, data[key]);
          return data[key];
        }
      }

      // If data itself is an array, return it
      if (Array.isArray(data)) {
        console.log('Response data is an array:', data);
        return data;
      }
    }

    console.log('Returning original data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching bases:', error);
    throw error;
  }
}; 