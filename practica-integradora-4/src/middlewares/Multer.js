// middleware/Multer.js
const multer = require('multer');
const fs = require('fs');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationPath;
    console.log(file)
    // Determinar la carpeta de destino según el campo fieldname
    if (file.fieldname === 'profiles') {
      destinationPath = 'uploads/profiles';
    } else if (file.fieldname === 'products') {
      destinationPath = 'uploads/products';
    } else {
      destinationPath = 'uploads/documents';
    }
    console.log(destinationPath)
    // Crea la carpeta de destino si no existe
    if (!fs.existsSync(destinationPath)) {
      try {
        fs.mkdirSync(destinationPath, { recursive: true });
      } catch (error) {
        console.error('Error al crear la carpeta:', error);
      }
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
