import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { uploadPublicBase } from '@/api/baseApi';
import type { BaseFormData } from '@/types/base';

export const useBaseUpload = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const uploadBaseWithImage = async (formData: BaseFormData) => {
    if (!isSignedIn) {
      toast.error("You must be signed in to upload a base");
      return false;
    }

    setIsLoading(true);

    try {
      const token = await getToken();

      // Only proceed if we have a token
      if (!token) {
        toast.error("Authentication failed. Please sign in again.");
        return false;
      }

      localStorage.setItem('backendToken', token as string);

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("link", formData.link);
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      if (userId) {
        submitData.append("clerkUserId", userId);
      }

      await uploadPublicBase(submitData);
      toast.success("Base uploaded successfully");
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload base"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadBaseWithImage,
    isLoading
  };
}; 