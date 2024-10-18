const express = require('express');
const router = express.Router();
const pool = require('../modules/pool'); 
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


router.get('/mylistings', rejectUnauthenticated,(req, res) => {
  const queryText = 'SELECT * FROM listings ORDER BY created_at DESC;';


  const queryParams = [req.user.id];  

  pool.query(queryText, queryParams)
    .then((result) => {
      res.status(200).json(result.rows); 
      console.log('Logged-in user:', req.user);
 
    })
    .catch((error) => {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Error fetching listings' });
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
  const { title, description, image_url, phone_number, address, city, state } = req.body;
  const user_id = req.user.id;  
  const queryText = `
    INSERT INTO listings (title, description, image_url, phone_number, address, city, state, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
  `;
  const queryParams = [title, description, image_url, phone_number, address, city, state, user_id];

  pool.query(queryText, queryParams)
    .then((result) => res.json(result.rows[0])) 
    .catch((err) => {
      console.error('Error creating listing:', err);
      res.sendStatus(500);
    });
});

module.exports = router;
