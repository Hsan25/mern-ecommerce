import multer from "multer";
import { Request } from "express";

// gunakan pengaturan ini jika ingin menyimpan di local
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     const fileExtension = file.originalname.split(".").pop();
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
//   },
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads");
//   },
// });

export interface RequestFile extends Request {
  fileValidationError?: string;
}

// Format yang diperbolehkan
export const extensionAllowed = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/avif",
];
export const maxSize = 5 * 1024 * 1024; // 5MB

// Middleware file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Cek mimetype, lebih aman daripada hanya cek ekstensi file
  if (!extensionAllowed.includes(file.mimetype)) {
    req.fileValidationError = `Invalid file type. Only ${extensionAllowed.join(
      ", ",
    )} allowed!`;
    return cb(null, false);
  }
  cb(null, true);
};

// Batas ukuran file
const limits = {
  fileSize: maxSize,
};

// Konfigurasi multer (pakai memory storage karena akan dikirim ke Cloudinary)
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits,
});
