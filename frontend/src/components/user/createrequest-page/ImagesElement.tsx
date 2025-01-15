import { useState } from "react";

const ImagesElement = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedImages = Array.from(event.target.files);
      setImages((prev) => [...prev, ...uploadedImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-8/12">
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
                src={URL.createObjectURL(image)}
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
