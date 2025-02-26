import axios from "axios";
import { useAuthHeaders } from "../hooks/useAuthHeaders";

const API_URL = import.meta.env.VITE_API_URL + "/public-bases";

// Fetch all bases
export const getPublicBases = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headers = useAuthHeaders();
    const response = await axios.get(API_URL, headers);
    return response.data;
    
};

// Fetch a single base
export const getPublicBaseById = async (id: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headers = useAuthHeaders();
    const response = await axios.get(`${API_URL}/${id}`, headers);
    return response.data;
};

// Create a new base
export const createPublicBase = async (data: { name: string; link: string }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headers = useAuthHeaders();
    const response = await axios.post(API_URL, data, headers);
    return response.data;
};

// Update an existing base
export const updatePublicBase = async (id: string, data: { name: string; link: string }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headers = useAuthHeaders();
    const response = await axios.put(`${API_URL}/${id}`, data, headers);
    return response.data;
};

// Delete a base
export const deletePublicBase = async (id: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headers = useAuthHeaders();
    await axios.delete(`${API_URL}/${id}`, headers);
};