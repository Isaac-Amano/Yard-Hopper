import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch listings after login
    axios.get('/api/listings')
      .then(response => {
        setListings(response.data);
      })
      .catch(error => {
        console.error('Error fetching listings:', error);
      });
  }, []);

  return (
    <div>
      <h2>Current Listings</h2>
      <div className="listing-grid">
        {listings.length > 0 ? (
          listings.map(listing => (
            <div key={listing.id} className="listing-card">
              <img src={listing.image_url} alt={listing.title} />
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>{listing.city}, {listing.state}</p>
            </div>
          ))
        ) : (
          <p>No listings available</p>
        )}
      </div>
    </div>
  );
};

export default Listings;
