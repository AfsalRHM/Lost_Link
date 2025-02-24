import { X } from "lucide-react";

const ImageModal = ({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition"
        >
          <X size={20} />
        </button>
        <img
          src={image}
          alt="Zoomed Image"
          className="w-full h-auto max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;
