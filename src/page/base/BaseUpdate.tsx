"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useBaseActions } from "@/hooks/useBaseActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { BaseFormData } from "@/types/base";
import { fetchBaseById } from "@/api/baseApi";
import { toast } from "sonner";

interface BaseData extends BaseFormData {
  imageUrl?: string;
  user?: {
    id: string;
    name: string;
    imageUrl: string;
    email: string;
  };
}

const getFullImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;

  // Get the base URL without the '/api/v1' part
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, "");

  // Ensure imageUrl starts with 'uploads/'
  const cleanImageUrl = imageUrl.startsWith("uploads/")
    ? imageUrl
    : `uploads/${imageUrl}`;

  return `${baseUrl}/${cleanImageUrl}`;
};

const BaseUpdate = () => {
  const { baseId } = useParams();
  const navigate = useNavigate();
  const { updateBase, deleteBase, isLoading } = useBaseActions(baseId);
  const [formData, setFormData] = useState<BaseData>({
    name: "",
    link: "",
    image: null,
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch current base data
  useEffect(() => {
    const fetchBase = async () => {
      if (!baseId) {
        console.error("No baseId provided");
        return;
      }

      try {
        setIsLoadingData(true);
        const baseData = await fetchBaseById(baseId);
        console.log("Fetched base data:", baseData);

        // Update form data
        setFormData({
          name: baseData.name || "",
          link: baseData.link || "",
          image: null,
          imageUrl: baseData.imageUrl || "",
        });

        // Set image preview
        if (baseData.imageUrl) {
          const fullImageUrl = getFullImageUrl(baseData.imageUrl);
          setImagePreview(fullImageUrl);
          console.log("Set image preview:", fullImageUrl);
        }
      } catch (error) {
        console.error("Error fetching base:", error);
        toast.error("Failed to load base data");
        navigate("/dashboard");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchBase();
  }, [baseId, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: "", // Clear the old imageUrl when new image is selected
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("link", formData.link);

    // Only append image if a new one is selected
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      const success = await updateBase(submitData);
      if (success) {
        toast.success("Base updated successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating base:", error);
      toast.error("Failed to update base");
    }
  };

  const handleDelete = async () => {
    const success = await deleteBase();
    if (success) {
      navigate("/dashboard"); // Adjust this path as needed
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading base data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Base</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Base Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter base name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Base Link</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Base Image</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={handleImageChange}
                />
                {(imagePreview || formData.imageUrl) && (
                  <div className="relative aspect-video w-full max-w-sm mx-auto">
                    <img
                      src={
                        imagePreview || getFullImageUrl(formData.imageUrl || "")
                      }
                      alt="Base preview"
                      className="object-contain rounded-lg w-full h-full"
                    />
                    {formData.imageUrl && !formData.image && (
                      <p className="text-sm text-muted-foreground mt-2 text-center"></p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Base"
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    Delete Base
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your base.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseUpdate;
