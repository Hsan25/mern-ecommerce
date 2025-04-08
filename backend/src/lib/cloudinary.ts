import { v2 as cloudinary } from "cloudinary";

// Pastikan ENV tidak undefined
if (
  !process.env.CLOUD_NAME ||
  !process.env.API_KEY ||
  !process.env.API_SECRET
) {
  throw new Error(
    "Cloudinary config missing. Please set environment variables.",
  );
}

// Konfigurasi Cloudinary
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// **UPLOAD IMAGE**
export async function uploadImage(file: string) {
  try {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "galaxy-store", // Gunakan folder khusus agar lebih terorganisir
    });
    return res;
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error("Failed to upload image.");
  }
}

// **GET IMAGE**
export const getImage = async (publicId: string) => {
  try {
    validatePublicId(publicId); // Validasi sebelum diproses
    const res = await cloudinary.api.resource(publicId);
    return res;
  } catch (error) {
    console.error("Get Image Error:", error);
    throw new Error("Failed to retrieve image.");
  }
};

// **DELETE IMAGE**
export const deleteImage = async (publicId: string) => {
  try {
    validatePublicId(publicId);
    const res = await cloudinary.uploader.destroy(publicId);
    return res;
  } catch (error) {
    console.error("Delete Image Error:", error);
    throw new Error("Failed to delete image.");
  }
};

// **UPDATE IMAGE (Reupload dengan ID yang sama)**
export const updateImage = async (image: string, publicId: string) => {
  try {
    validatePublicId(publicId);
    const res = await cloudinary.uploader.upload(image, {
      public_id: publicId,
      overwrite: true, // Pastikan gambar lama ditimpa
    });
    return res;
  } catch (error) {
    console.error("Update Image Error:", error);
    throw new Error("Failed to update image.");
  }
};

// **VALIDASI PUBLIC ID (Mencegah Injeksi ID Ilegal)**
const validatePublicId = (publicId: string) => {
  const regex = /^[a-zA-Z0-9-_\/]{1,255}$/; // Hanya huruf, angka, -, _, dan /
  if (!regex.test(publicId)) {
    throw new Error("Invalid publicId format.");
  }
};
