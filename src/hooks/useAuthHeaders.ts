import { useAuthToken } from "./useAuthToken";

export const useAuthHeaders = () => {
    const token = useAuthToken();
    return { headers: { Authorization: `Bearer ${token}` } };
}; 