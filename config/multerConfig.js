const multer = require("multer");
const sharp = require("sharp");
const path = require("path");


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
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const outputPath = path.join("public/images", `${Date.now()}-${i}.jpg`);

     
        await sharp(file.buffer)
            .resize(100, 100, { fit: "cover" }) 
            .toFile(outputPath);

        imagePaths.push(`/images/${path.basename(outputPath)}`);
    }
    return imagePaths;
};

module.exports = { upload, processImages };