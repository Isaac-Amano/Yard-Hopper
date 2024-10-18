import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ViewListings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings ||[]);  
  useEffect(() => {
    // Dispatch the action to fetch listings (handled by the saga)
    dispatch({ type: 'FETCH_LISTINGS' });
  }, [dispatch]);

  return (
    <div>
      <h2>Current Listings</h2>
      <div className="listing-grid">
        {listings.length > 0 ? (
          listings.map((listing) => (
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

export default ViewListings;
