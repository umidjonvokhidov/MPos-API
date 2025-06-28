import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads/users"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const { name, ext } = path.parse(file.originalname);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const productPictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads/products"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const { name, ext } = path.parse(file.originalname);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

export const uploadUserProfilePhoto = multer({
  storage: profilePictureStorage,
});
export const uploadproductPicturePhoto = multer({
  storage: productPictureStorage,
});
