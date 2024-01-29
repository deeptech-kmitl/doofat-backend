import multer from 'multer';
const { memoryStorage } = require('multer');
import path from 'path';

const multerMiddleware = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5,  // 5MB
    },
    fileFilter: function (req, file, callback) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return callback(null, true);
        }

        callback(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    },
})

export default multerMiddleware;