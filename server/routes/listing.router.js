const express = require('express');
const router = express.Router();
const pool = require('../modules/pool'); 
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


// Current listings on DB not showing, even if i hard coded dummy data into DB 
router.get('/', (req, res) => {
  const queryText = 'SELECT * FROM listings ORDER BY created_at DESC;';
  
  pool.query(queryText)
    .then((result) => {
      res.status(200).json(result.rows); 

      console.log('All Listings:', result.rows);

    })
    .catch((error) => {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error});
    });
});


// my listing is not working, nothing is showing even after i add a listing 
router.get('/mylistings', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC;';
  const queryParams = [req.user.id];  

  pool.query(queryText, queryParams)
    .then((result) => {
      res.status(200).json(result.rows);
      console.log('User Listings:', result.rows);
    })
    .catch((error) => {
      console.error('Error fetching user listings:', error);
      res.status(500).json({ error: 'Error fetching user listings' });
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
  console.log('Received stuff for new listing:', req.body);  

  
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
    res.sendStatus(204);  
  })
  .catch((err) => {
    console.error('Error deleting listing:', err);
    res.sendStatus(500);
  });
});

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
