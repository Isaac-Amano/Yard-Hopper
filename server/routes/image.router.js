const express = require('express');
const router = express.Router();
const cloudinary = require('../modules/cloudinaryConfig'); // Import Cloudinary configuration
const multer = require('multer');

// Configure multer for memory storage (storing files in memory instead of disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle image upload to Cloudinary
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    // Upload image to Cloudinary using an upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        fetch_format: 'auto', // Optimize format
        quality: 'auto',      // Optimize quality
        width: 500,           // Optional width for resizing
        height: 500,          // Optional height for resizing
        crop: 'fill'          // Crop image to fill specified width and height
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ error: 'Upload failed' });
        }
        // Successful upload, respond with the URL of the uploaded image
        res.status(200).json({ url: result.secure_url });
      }
    );

    // Pipe the image file stream to Cloudinary
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
