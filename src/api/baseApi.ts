import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
//console.log('API URL from .env:', API_URL);

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

// Helper function to get base URL without API path
const getBaseURL = () => {
  // Remove any API path segments like /api/v1
  return API_URL.replace(/\/api\/v1\/?$/, '');
};

export const fetchBases = async () => {
  try {
    const response = await baseApi.get("/public-bases");
    const { data } = response;

    //console.log('API Response Data:', data);

    // Extract and sort array data from common response patterns
    if (data && typeof data === 'object') {
      const possibleArrays = ['data', 'results', 'bases'];
      let baseArray;

      // Get the first valid array found in the response
      for (const key of possibleArrays) {
        if (data[key] && Array.isArray(data[key])) {
          console.log(`Found array in response.${key}:`, data[key]);
          baseArray = data[key];
          break;
        }
      }

      // If no array found in nested properties, check if data itself is an array
      if (!baseArray && Array.isArray(data)) {
        console.log('Response data is an array:', data);
        baseArray = data;
      }

      // If we found an array, process image URLs and sort by date
      if (baseArray) {
        const baseURL = getBaseURL();
        //console.log('Base URL for images:', baseURL);

        return baseArray.map(base => {
          // Log the original image URL for debugging
          //console.log(`Original imageUrl for base ${base.id}:`, base.imageUrl);

          // Construct proper image URL
          let fullImageUrl = null;
          if (base.imageUrl) {
            // If it's already a full URL, use it as is
            if (base.imageUrl.startsWith('http')) {
              fullImageUrl = base.imageUrl;
            }
            // If it's a relative path starting with 'uploads/', construct the correct URL
            else if (base.imageUrl.startsWith('uploads/')) {
              fullImageUrl = `${baseURL}/${base.imageUrl}`;
            }
            // Otherwise, assume it needs the base URL and 'uploads/'
            else {
              fullImageUrl = `${baseURL}/uploads/${base.imageUrl}`;
            }
          }

          //console.log(`Processed imageUrl for base ${base.id}:`, fullImageUrl);

          return {
            ...base,
            imageUrl: fullImageUrl,
            // Ensure user avatar is absolute
            user: base.user ? {
              ...base.user,
              avatar: base.user.imageUrl || null
            } : null
          };
        }).sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.createdAt || b.updatedAt || 0);
          return dateB.getTime() - dateA.getTime(); // Most recent first
        });
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
    // Log request details
    console.log('API URL:', import.meta.env.VITE_API_URL);
    console.log('Token:', localStorage.getItem('backendToken'));
    console.log('FormData contents:', {
      name: formData.get('name'),
      link: formData.get('link'),
      image: formData.get('image') ? 'Image present' : 'No image',
      clerkUserId: formData.get('clerkUserId')
    });

    const response = await baseApi.post("/public-bases", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    if (!response.data) {
      throw new Error('No response data received');
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'Upload failed');
    }

    return response.data;
  } catch (error) {
    console.error('Upload error details:', error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Upload failed: ${message}`);
    }
    throw error;
  }
};

export const updatePublicBase = async (baseId: string, formData: FormData) => {
  try {
    const response = await baseApi.put(`/public-bases/${baseId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating base:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to update base");
    }
    throw new Error("Failed to update base");
  }
};

export const deletePublicBase = async (baseId: string) => {
  try {
    const response = await baseApi.delete(`/public-bases/${baseId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting base:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to delete base");
    }
    throw new Error("Failed to delete base");
  }
};

export const fetchBaseById = async (baseId: string) => {
  try {
    const response = await baseApi.get(`/public-bases/${baseId}/`);
    console.log('API Response for base:', response.data);
    // The backend returns { success: true, data: baseObj }
    return response.data.data; // Extract the base data from the response
  } catch (error) {
    console.error('Error fetching base:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch base");
    }
    throw new Error("Failed to fetch base");
  }
};

export default baseApi;

