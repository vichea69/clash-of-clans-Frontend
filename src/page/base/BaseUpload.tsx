"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { useBaseUpload } from "@/hooks/useBaseUpload";
import type { BaseFormData } from "@/types/base";
import { toast } from "sonner";
import ActionButton from "@/components/ui/action-button";

interface BaseUploadProps {
  onSuccess?: () => void;
}

const BaseUpload = ({ onSuccess }: BaseUploadProps) => {
  const { uploadBaseWithImage } = useBaseUpload();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<BaseFormData>({
    name: "",
    link: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

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

    // Form validation
    if (!formData.name.trim()) {
      toast.error("Please enter a base name");
      return;
    }

    if (!formData.link.trim()) {
      toast.error("Please enter a base link");
      return;
    }

    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    // Image validation
    if (formData.image.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(formData.image.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    setIsPending(true);
    try {
      const success = await uploadBaseWithImage(formData);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload base");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Base</CardTitle>
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
                  required
                  className="cursor-pointer"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="relative aspect-video w-full max-w-sm mx-auto">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Base preview"
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Upload an image to see preview
                    </p>
                  </div>
                )}
              </div>
            </div>

            <ActionButton
              isPending={isPending}
              className="w-full"
              variant="default"
              size="default"
            >
              Upload Base
            </ActionButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseUpload;
