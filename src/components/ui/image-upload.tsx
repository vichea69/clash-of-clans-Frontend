import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  required?: boolean;
  id?: string;
  name?: string;
}

export const ImageUpload = ({ onChange, value, required, id, name }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null);
      setPreview("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        id={id}
        name={name}
        type="file"
        accept="image/*"
        required={required}
        className="cursor-pointer"
        onChange={handleImageChange}
      />
      {preview ? (
        <div className="relative aspect-video w-full max-w-sm mx-auto">
          <img
            src={preview || "/placeholder.svg"}
            alt="Image preview"
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
  );
}; 