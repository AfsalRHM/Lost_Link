const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

export async function uploadToCloudinary({ currentImage, uploadPreset }: { currentImage: File, uploadPreset: string }) {
  const formData = new FormData();
  formData.append("file", currentImage);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary From the Utils:", error);
  }
}
