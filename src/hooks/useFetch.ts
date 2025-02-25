import { useEffect, useState } from 'react';

// Define a generic response type to handle common API response patterns
interface ApiResponse<T> {
    data?: T;
    results?: T;
    [key: string]: any;
}

const useFetch = <T>(url: string) => {
    // Update the type to accept either T directly or an ApiResponse containing T
    const [data, setData] = useState<T | ApiResponse<T> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
};

export default useFetch; 