import { useState } from "react";
import { ImagesElementProps } from "../../../interface/IrequestProps";
import ValidationError from "../shared/ValidationError";

const ImagesElement = ({ onChange, errorData }: ImagesElementProps) => {
  const [images, setImages] = useState<File[]>([]);

  const CLOUDINARY_UPLOAD_PRESET = "product_preset";
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dnxt7foko/image/upload";

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const uploadedImages = Array.from(event.target.files);

      // Prepare the uploaded images for Cloudinary upload
      const uploadedImageUrls: any[] = [];

      for (const image of uploadedImages) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
          const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.secure_url) {
            uploadedImageUrls.push(data.secure_url);
          }
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
      }

      console.log(uploadedImageUrls);

      setImages((prev) => [...prev, ...uploadedImageUrls]);

      onChange(uploadedImageUrls);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-8/12">
      <ValidationError
        display={errorData.display}
        name="userLoginValidation"
        content={errorData.content}
      />
      <p className="text-violet-700 font-semibold mb-2">Upload Images</p>
      <div className="border border-dashed border-gray-400 rounded-md p-4 bg-gray-100">
        <label className="flex flex-col items-center cursor-pointer">
          <span className="text-violet-700 font-medium">
            Click to upload images
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Uploaded preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesElement;
