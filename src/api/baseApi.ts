import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const baseApi = axios.create({
  baseURL: API_URL
});

// Add request interceptor
baseApi.interceptors.request.use(
  (config) => {
    // Get the backend JWT token
    const token = localStorage.getItem('backendToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For public routes that don't require authentication
      // We don't set the Authorization header
      console.log('No authentication token found in localStorage');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchBases = async () => {
  try {
    const response = await baseApi.get("/public-bases");
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

export const uploadPublicBase = async (formData: FormData) => {
  try {
    const response = await baseApi.post("/public-bases/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading base:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to upload base");
    }
    throw new Error("Failed to upload base");
  }
};

export default baseApi;
