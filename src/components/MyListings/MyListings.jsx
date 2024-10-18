import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MyListings = () => {
  const dispatch = useDispatch();
  const userListings = useSelector((state) => state.userListings);  // Use user-specific listings from Redux

  useEffect(() => {
    // Dispatch the action to fetch the user's listings
    dispatch({ type: 'FETCH_USER_LISTINGS' });
  }, [dispatch]);

  return (
    <div>
      <h2>My Listings</h2>
      <div className="listing-grid">
        {userListings.length > 0 ? (
          userListings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <img src={listing.image_url} alt={listing.title} />
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>{listing.city}, {listing.state}</p>
              {/* Buttons to Edit or Delete Listing */}
              <button>Edit</button>
              <button>Delete</button>
            </div>
          ))
        ) : (
          <p>No listings available</p>
        )}
      </div>
    </div>
  );
};

export default MyListings;
