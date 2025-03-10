import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { uploadPublicBase } from '@/api/baseApi';
import type { BaseFormData } from '@/types/base';

export const useBaseUpload = () => {
  const { getToken, isSignedIn, userId } = useAuth();

  const uploadBaseWithImage = async (formData: BaseFormData) => {
    if (!isSignedIn) {
      toast.error("You must be signed in to upload a base");
      return false;
    }

    try {
      // Get token without specifying template
      const token = await getToken();
      console.log('Authentication status:', { isSignedIn, hasToken: !!token });

      if (!token) {
        toast.error("Authentication failed. Please sign in again.");
        return false;
      }

      // Store token and create form data
      localStorage.setItem('backendToken', token);

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("link", formData.link.trim());

      if (formData.image) {
        const imageFile = formData.image;
        submitData.append("image", imageFile);
      }

      if (userId) {
        submitData.append("clerkUserId", userId);
      }

      const response = await uploadPublicBase(submitData);
      console.log('Upload successful:', response);
      toast.success("Base uploaded successfully");
      return true;
    } catch (error) {
      console.error("Form submission error:", error);
      throw error; // Let the component handle the error
    }
  };

  return {
    uploadBaseWithImage
  };
}; 