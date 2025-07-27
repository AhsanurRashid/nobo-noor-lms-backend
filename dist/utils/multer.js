"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (_, __, cb) {
        const dir = "uploads/lessons";
        // Ensure folder exists
        fs_1.default.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (_, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (_, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (![".mp4", ".pdf", ".docx", ".zip"].includes(ext)) {
            return cb(new Error("Only mp4, pdf, docx, and zip allowed"));
        }
        cb(null, true);
    },
});
