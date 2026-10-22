import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.resolve("uploads");

fs.mkdirSync(uploadDirectory, {
  recursive: true
});

const storage = multer.diskStorage({

  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {

    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    callback(
      null,
      `${Date.now()}-${safeName}`
    );
  }
});

const fileFilter = (_req, file, callback) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

export const uploadIssueImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single("image");