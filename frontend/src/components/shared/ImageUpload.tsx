import { ImageUp } from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { useLocation } from "react-router-dom";
interface PropsType {
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  setChatImage: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload = ({ setPreviewImages, setChatImage }: PropsType) => {
  const location = useLocation();
  const currentLocation = location.pathname;

  const sideFrom = currentLocation.split("/")[1];

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));

      setPreviewImages((prev) => [...prev, ...previewArray]);

      const response = await uploadToCloudinary({
        currentImage: fileArray[0],
        uploadPreset: "chat_preset",
      });

      setChatImage(response);
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-2"></div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="imageUpload"
        max="1"
      />
      <label
        htmlFor="imageUpload"
        className={`${
          sideFrom == "admin"
            ? "bg-blue-500 hover:bg-blue-600 mr-2"
            : "bg-violet-500 hover:bg-violet-600"
        } text-white p-3 rounded-xl cursor-pointer  transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2`}
      >
        <ImageUp size={20} />
      </label>
    </>
  );
};

export default ImageUpload;
