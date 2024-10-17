import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewListings = () => {
  const [listings, setListings] = useState([]);

  // Fetch the listings from the backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      <h2>All Listings</h2>
      <div className="listings-grid">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="listing">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>Phone: {listing.phone_number}</p>
              <p>Address: {listing.address}, {listing.city}, {listing.state}</p>
              {listing.image_url && (
                <img src={listing.image_url} alt={listing.title} style={{ width: '200px' }} />
              )}
            </div>
          ))
        ) : (
          <p>No listings available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewListings;
