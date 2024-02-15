const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './upload');
    },
    filename: (req, file, callback) => {
        const filename = `image-${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

const multerConfig = multer({
    storage
});

module.exports = multerConfig