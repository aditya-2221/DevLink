import multer from "multer";
import path from "path";
import ApiError from "../utils/ApiError.js";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./public/temp");
    },

    filename(req, file, cb) {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        )
    }
})

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".json",
    ".zip",
    ".rar",
    ".mp4"
];

const attachmentUpload = multer({

    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter(req, file, cb) {

        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        if (!allowedExtensions.includes(extension)) {

            return cb(
                new ApiError(
                    400,
                    `${extension} files are not supported`
                )
            );

        }

        cb(null, true);

    }

});

export { attachmentUpload };