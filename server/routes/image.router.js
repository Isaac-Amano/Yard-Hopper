const express = require('express');
const router = express.Router();
const cloudinary = require('../modules/cloudinary');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ error: 'Upload failed' });
      }
      res.status(200).json({ url: result.secure_url });
    });
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error during upload' });
  }
});

module.exports = router;
