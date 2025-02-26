import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch JWT token from Clerk after login.
 */
export const useAuthToken = () => {
    const { getToken } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const jwt = await getToken(); // Fetch JWT token from Clerk
            console.log(jwt); // Log the token after getting it
            setToken(jwt);
        };
        fetchToken();
    }, [getToken]);

    return token;
};