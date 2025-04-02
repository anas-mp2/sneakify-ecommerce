const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads/products/');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const processImages = async (files) => {
    const imagePaths = [];
    for (const file of files) {
        const inputPath = path.join(__dirname, '../../public/uploads/products/', file.filename);
        const outputPath = path.join(__dirname, '../../public/uploads/products/', `processed-${file.filename}`);

        await sharp(inputPath)
            .resize(800, 800, { fit: 'cover' })
            .toFile(outputPath);

        // Optionally delete the original unprocessed file
        fs.unlinkSync(inputPath);

        imagePaths.push(`/uploads/products/processed-${file.filename}`);
    }
    return imagePaths;
};

module.exports = { upload, processImages };