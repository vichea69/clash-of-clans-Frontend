import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { updatePublicBase, deletePublicBase } from '@/api/baseApi';

export const useBaseActions = (baseId?: string) => {
    const { getToken, isSignedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const updateBase = async (formData: FormData) => {
        if (!isSignedIn) {
            toast.error("You must be signed in to update a base");
            return false;
        }

        if (!baseId) {
            toast.error("No base ID provided");
            return false;
        }

        setIsLoading(true);

        try {
            const token = await getToken();

            if (!token) {
                toast.error("Authentication failed. Please sign in again.");
                return false;
            }

            localStorage.setItem('backendToken', token as string);

            const response = await updatePublicBase(baseId, formData);
            if (response.success) {
                toast.success("Base updated successfully");
                return true;
            } else {
                toast.error(response.message || "Failed to update base");
                return false;
            }
        } catch (error) {
            console.error("Error updating base:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to update base"
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBase = async () => {
        if (!isSignedIn) {
            toast.error("You must be signed in to delete a base");
            return false;
        }

        if (!baseId) {
            toast.error("No base ID provided");
            return false;
        }

        setIsLoading(true);

        try {
            const token = await getToken();

            if (!token) {
                toast.error("Authentication failed. Please sign in again.");
                return false;
            }

            localStorage.setItem('backendToken', token as string);

            await deletePublicBase(baseId);
            toast.success("Base deleted successfully");
            return true;
        } catch (error) {
            console.error("Error deleting base:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to delete base"
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateBase,
        deleteBase,
        isLoading
    };
}; 