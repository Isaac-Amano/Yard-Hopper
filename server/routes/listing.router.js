const express = require('express');
const router = express.Router();
const pool = require('../modules/pool'); 
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


router.get('/mylistings', rejectUnauthenticated,(req, res) => {
  const queryText = 'SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC;';


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
  console.log('Received data for new listing:', req.body);  

  
  const { title, description, 
    image_url_1, 
    image_url_2, 
    image_url_3, 
    phone_number, 
    address, 
    city,
    state } = req.body;
  const user_id = req.user.id;  
  const queryText = `
    INSERT INTO listings (title, description, image_url_1, image_url_2, image_url_3, phone_number, address, city, state, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
  `;
  const queryParams = [title,
     description,
      image_url_1, 
      image_url_2, 
      image_url_3, 
      phone_number, 
      address, 
      city,
      state,
      user_id];

  pool.query(queryText, queryParams)
    .then(result => res.json(result.rows[0]))
    .catch(err => {
      console.error('Error creating listing:', err);
      res.sendStatus(500);  
    });
});

router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const listingId = req.params.id;
  const userId = req.user.id; 

  const queryText = `DELETE FROM listings WHERE id = $1 AND user_id = $2;`; 
  const queryParams = [listingId, userId];

  pool.query(queryText, queryParams)
  .then((result) => {
    if (result.rowCount === 0) {
      console.log('nothing found to delete');
      return res.sendStatus(404);
    }
    console.log('Listing deleted:', result.rowCount);
    res.sendStatus(204);  // yay!
  })
  .catch((err) => {
    console.error('Error deleting listing:', err);
    res.sendStatus(500);
  });
});


module.exports = router;
