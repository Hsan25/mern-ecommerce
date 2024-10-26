import multer from "multer";
import { Request } from "express";
export const extensionAllowed = ["png", "jpg", "jpeg"];
export const maxSize = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
});

export interface RequestFile extends Request {
  fileValidationError?: string;
}

const fileFilter = (
  req: RequestFile,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const fileExtension: string = file.originalname.split(".").pop() || "";
  if (!extensionAllowed.includes(fileExtension)) {
    req.fileValidationError = `Invalid type file. Type Allowed ${extensionAllowed}`;
    return cb(null, false);
  }
  cb(null, true);
};
const limits = {
  fileSize: maxSize,
};

export const upload = multer({ storage, fileFilter, limits });
