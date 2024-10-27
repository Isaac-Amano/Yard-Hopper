import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; //for nav

const Listings = () => {
  const dispatch = useDispatch();

  const listings = useSelector(state => state.listings); // Get all listings from Redux

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_LISTINGS' }); // Fetch all listings when the page loads
  }, []);


  console.log('Current listings ', listings); 
  // to know the listings are being correctly set in the Redux store. 

  return (
    <div>
      <h2>All Listings</h2>
      <div className="listing-grid">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              {/* Link to individual listing's detail page */}
              <Link to={`/listings/${listing.id}`}>View Details</Link>
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