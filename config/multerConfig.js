const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const mkdirp = require("mkdirp"); // Ensure this is installed

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"), false);
        }
    }
}).array("images", 10);

const processImages = async (files) => {
    const imagePaths = [];
    const uploadDir = path.join(__dirname, "../public/uploads/products");

    // Use mkdirp correctly with modern API
    await mkdirp(uploadDir); // mkdirp returns a promise in newer versions

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filename = `${Date.now()}-${i}-${file.originalname}`;
        const outputPath = path.join(uploadDir, filename);

        await sharp(file.buffer)
            .resize(800, 800, { fit: "cover" })
            .toFile(outputPath);

        imagePaths.push(`/uploads/products/${path.basename(outputPath)}`);
    }
    return imagePaths;
};

module.exports = { upload, processImages };