import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './MyListings.css';


const MyListings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userListings = useSelector((state) => state.userListings);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch({ type: 'FETCH_USER_LISTINGS' });
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch({ type: 'DELETE_LISTING', payload: id });
      setMessage('Listing deleted successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit button clicked for listing ID: ${id}`);
    history.push(`/edit/${id}`);
  };

  return (
    <div>
      <button onClick={() => history.push('/listings')} style={{ marginBottom: '20px' }}>
        &larr; Back to Listings
      </button>

      <h2>My Listings</h2>
      
      {message && <div className="message-box">{message}</div>}

      <div className="listing-grid">
        {userListings && userListings.length > 0 ? (
          userListings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <img src={listing.image_url_1} alt={listing.title} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>{listing.city}, {listing.state}</p>

              <button onClick={() => handleEdit(listing.id)} style={{ marginRight: '10px' }}>Edit</button>
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
