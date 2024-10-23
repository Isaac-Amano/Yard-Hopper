import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const Listings = () => {
  const dispatch = useDispatch();

  const listings = useSelector(state => state.listings); // Get all listings from Redux

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_LISTINGS' }); // Fetch all listings when the page loads
  }, [dispatch]);

  if (!listings) return <div>Loading...</div>;

  return (
    <div>
      <h2>All Listings</h2>
      <div className="listing-grid">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
           
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