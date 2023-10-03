const multer = require("multer");

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for uploaded images
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded images
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
});
module.exports = upload.array("photos", 5);
