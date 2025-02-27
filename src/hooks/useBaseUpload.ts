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
        console.log('Image details:', {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size
        });
        submitData.append("image", imageFile);
      }

      if (userId) {
        submitData.append("clerkUserId", userId);
      }

      try {
        const response = await uploadPublicBase(submitData);
        console.log('Upload successful:', response);
        toast.success("Base uploaded successfully");
        return true;
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed");
        return false;
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process upload");
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