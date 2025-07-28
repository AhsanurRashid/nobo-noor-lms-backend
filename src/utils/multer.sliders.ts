import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const dir = "uploads/sliders";

    // Ensure folder exists
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: function (_, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});


export const uploadSliders = multer({ storage, fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".webp", ".png"].includes(ext)) {
      return cb(new Error("Only jpg, jpeg, webp, and png allowed"));
    }
    cb(null, true);
  }
});
