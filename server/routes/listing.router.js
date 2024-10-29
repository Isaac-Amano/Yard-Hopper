const express = require('express');
const router = express.Router();
const pool = require('../modules/pool'); 
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// Fetch all listings with optional search filtering
router.get('/', (req, res) => {
  const search = req.query.search || ''; // Get the search term from query parameters, default to empty

  let queryText = 'SELECT * FROM listings';
  let queryParams = [];

  if (search) {
    // Add filtering conditions 
    queryText += ` WHERE description ILIKE $1 OR city ILIKE $1 OR state ILIKE $1 ORDER BY created_at DESC`;
    queryParams.push(`%${search}%`);
  } else {
    // Default query without filtering
    queryText += ' ORDER BY created_at DESC';
  }

  pool.query(queryText, queryParams)
    .then((result) => {
      res.status(200).json(result.rows); 
      console.log('Filtered Listings:', result.rows);
    })
    .catch((error) => {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error });
    });
});

// Fetch a single listing by ID
router.get('/:id', (req, res) => {
  const listingId = req.params.id;
  const queryText = 'SELECT * FROM listings WHERE id = $1;';
  const queryParams = [listingId];

  pool.query(queryText, queryParams)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.sendStatus(404);  
      }
      res.json(result.rows[0]);
    })
    .catch((error) => {
      console.error('Error fetching single listing:', error);
      res.status(500).json({ error: 'Error fetching listing' });
    });
});

// Fetch user-specific listings
// ISSUE IS HERE




router.get('/mylistings', rejectUnauthenticated, (req, res) => {
  if (!req.user || !req.user.id) {
    console.error('User is not authenticated or req.user.id is missing');
    return res.status(500).json({ error: 'User not authenticated' });
  }

  const queryText = 'SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC;';
  const queryParams = [req.user.id]; 

  pool.query(queryText, queryParams)
    .then((result) => {
      console.log('User listings:', result.rows);
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching user listings:', error);
      res.status(500).json({ error });
    });
});







// Create a new listing
router.post('/', rejectUnauthenticated, (req, res) => {
  console.log('Received stuff for new listing:', req.body);  

  const { title, description, image_url_1, image_url_2, image_url_3, phone_number, address, city, state } = req.body;
  const user_id = req.user.id;  
  const queryText = `
    INSERT INTO listings (title, description, image_url_1, image_url_2, image_url_3, phone_number, address, city, state, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
  `;
  const queryParams = [title, description, image_url_1, image_url_2, image_url_3, phone_number, address, city, state, user_id];

  pool.query(queryText, queryParams)
    .then(result => res.json(result.rows[0]))
    .catch(err => {
      console.error('Error creating listing:', err);
      res.sendStatus(500);  
    });
});

// Delete a listing by ID
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const listingId = req.params.id;
  const userId = req.user.id; 

  const queryText = `DELETE FROM listings WHERE id = $1 AND user_id = $2;`; 
  const queryParams = [listingId, userId];

  pool.query(queryText, queryParams)
  .then((result) => {
    if (result.rowCount === 0) {
      console.log('Nothing found to delete');
      return res.sendStatus(404);
    }
    console.log('Listing deleted:', result.rowCount);
    res.sendStatus(204);  
  })
  .catch((err) => {
    console.error('Error deleting listing:', err);
    res.sendStatus(500);
  });
});

// Update a listing
router.put('/:id', rejectUnauthenticated, (req, res) => {
  const listingId = req.params.id;
  const userId = req.user.id;  

  const { title, description, phone_number, address, city, state } = req.body;

  const queryText = `
    UPDATE listings 
    SET title = $1, description = $2, phone_number = $3, address = $4, city = $5, state = $6
    WHERE id = $7 AND user_id = $8
    RETURNING *;
  `;
  const queryParams = [title, description, phone_number, address, city, state, listingId, userId];

  pool.query(queryText, queryParams)
    .then((result) => {
      if (result.rowCount === 0) {
        res.sendStatus(404); 
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch((error) => {
      console.error('Error updating listing:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
