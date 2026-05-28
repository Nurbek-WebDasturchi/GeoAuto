import multer from "multer";
import { AppError } from "../utils/http.js";

const storage = multer.memoryStorage();

export const uploadImages = multer({
  storage,
  limits: {
    files: 8,
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(new AppError(415, "Faqat JPG, PNG yoki WEBP rasm yuklang."));
      return;
    }
    cb(null, true);
  }
});
