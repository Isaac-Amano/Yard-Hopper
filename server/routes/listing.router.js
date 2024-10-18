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
    })
    .catch((error) => {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Error fetching listings' });
    });
});

module.exports = router;
