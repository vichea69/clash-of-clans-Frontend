import axios from 'axios';
import { Base } from "@/types/base";

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

interface FetchBasesParams {
  page?: number;
  limit?: number;
  sort?: string;
  month?: string; // Format: YYYY-MM
}

interface FetchBasesResponse {
  success: boolean;
  data: Base[];
  total: number;
  page: number;
  totalPages: number;
  message: string;
}

interface ApiBase {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  user?: {
    name: string;
    imageUrl: string | null;
  };
  clerkUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchBases = async (params: FetchBasesParams = {}): Promise<FetchBasesResponse> => {
  try {
    const response = await baseApi.get("/public-bases", {
      params: {
        page: params.page || 1,
        limit: 50,
        ...params
      }
    });

    const { data } = response;

    if (data && typeof data === 'object') {
      // Process the response data
      const baseURL = getBaseURL();

      if (data.data && Array.isArray(data.data)) {
        const processedBases = data.data.map((base: ApiBase) => ({
          ...base,
          imageUrl: processImageUrl(base.imageUrl, baseURL),
          user: {
            name: base.user?.name || "Unknown",
            avatar: base.user?.imageUrl || null
          }
        }));

        return {
          ...data,
          data: processedBases
        };
      }
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching bases:', error);
    throw error;
  }
};

// Helper function to process image URLs
const processImageUrl = (imageUrl: string | null, baseURL: string): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('uploads/')) return `${baseURL}/${imageUrl}`;
  return `${baseURL}/uploads/${imageUrl}`;
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

interface MonthlyBaseCount {
  monthYear: string;
  count: number;
  displayName: string;
}

interface FetchBasesByMonthsResponse {
  success: boolean;
  data: MonthlyBaseCount[];
  message: string;
}

export const fetchBasesByMonths = async (): Promise<FetchBasesByMonthsResponse> => {
  try {
    const response = await baseApi.get("/public-bases/months");
    return response.data;
  } catch (error) {
    console.error('Error fetching bases by months:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch bases by months");
    }
    throw new Error("Failed to fetch bases by months");
  }
};

export default baseApi;
