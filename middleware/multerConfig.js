const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cbFunc) => {
    cbFunc(null, "./storage");
  },
  filename: (req, file, cbFunc) => {
    const name = new Date().getTime().toString()
    cbFunc(null, name + file.originalname);
  },
});

module.exports = { multer, storage };
