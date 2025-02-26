"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2 } from "lucide-react";
import { useBaseUpload } from "@/hooks/useBaseUpload";
import type { BaseFormData } from "@/types/base";

interface BaseUploadProps {
  onSuccess?: () => void;
}

const BaseUpload = ({ onSuccess }: BaseUploadProps) => {
  const { uploadBaseWithImage, isLoading } = useBaseUpload();
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

    const success = await uploadBaseWithImage(formData);
    if (success && onSuccess) {
      onSuccess();
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Base"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseUpload;
