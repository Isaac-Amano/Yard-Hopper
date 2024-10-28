import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_LISTINGS' }); // Fetch all listings initially
  }, [dispatch]);

  const handleSearch = () => {
    dispatch({ type: 'FETCH_ALL_LISTINGS', payload: searchTerm }); // Dispatch search term
  };

  // Clear search function
  const clearSearch = () => {
    setSearchTerm(''); // Reset search term
    dispatch({ type: 'FETCH_ALL_LISTINGS' }); // Fetch all listings without any filter
  };

  return (
    <div>
      <h2>All Listings</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by description, city, or state"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={clearSearch}>Clear</button> {/* Clear search button */}

      <div className="listing-grid">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
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
