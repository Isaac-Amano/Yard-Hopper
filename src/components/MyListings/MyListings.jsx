import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MyListings = () => {
  const dispatch = useDispatch();
  const userListings = useSelector((state) => state.userListings);  // listings from Redux

  useEffect(() => {
    
    dispatch({ type: 'FETCH_USER_LISTINGS' });
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')){
        dispatch({ type: 'DELETE_LISTING', payload: id });
    }
  };


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
              
              <button>Edit</button>


                {/* Edit button onclick add it below!!!! */}
              {/* <button onClick={() => handleEdit(listing.id)}>Delete</button> */}
              <button onClick={() => handleDelete(listing.id)}>Delete</button>
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
