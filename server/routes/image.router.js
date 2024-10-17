const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../modules/cloudinary'); // Import Cloudinary config
const fs = require('fs');

// Set up Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;

  // Upload image to Cloudinary
  cloudinary.uploader.upload(filePath, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Image upload failed' });
    }

    // Get the Cloudinary URL
    const imageUrl = result.secure_url;

    // Optionally delete the temporary file after upload
    fs.unlinkSync(filePath);

    // Respond with the Cloudinary URL
    res.status(200).json({ imageUrl });
  });
});

module.exports = router;
