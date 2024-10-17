const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../modules/cloudinary'); // Import Cloudinary config
const fs = require('fs');
const pool = require('../modules/pool');


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

    const { title, description, phone_number, address, city, state } = req.body;  // Assuming these come from your form
    const queryText = `
      INSERT INTO listings (title, description, phone_number, image_url, address, city, state)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const queryParams = [title, description, phone_number, imageUrl, address, city, state];

    pool.query(queryText, queryParams)
      .then((dbRes) => res.status(200).json(dbRes.rows[0]))  // Respond with the created listing
      .catch((dbErr) => {
        console.error('Database error:', dbErr);
        res.status(500).json({ error: 'Database insert failed' });
      });

    // Respond with the Cloudinary URL
   
  });
});

module.exports = router;
