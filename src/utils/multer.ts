import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const dir = "uploads/lessons";

    // Ensure folder exists
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: function (_, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});


export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".mp4", ".pdf", ".docx", ".zip"].includes(ext)) {
      return cb(new Error("Only mp4, pdf, docx, and zip allowed"));
    }
    cb(null, true);
  },
});
