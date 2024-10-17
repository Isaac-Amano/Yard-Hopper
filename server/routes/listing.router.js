const express = require('express');
const router = express.Router();
const pool = require('../modules/pool'); 


router.get('/', (req, res) => {
  const queryText = 'SELECT * FROM listings ORDER BY created_at DESC;';

  pool.query(queryText)
    .then((result) => {
      res.status(200).json(result.rows);  
    })
    .catch((error) => {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Error fetching listings' });
    });
});

module.exports = router;
