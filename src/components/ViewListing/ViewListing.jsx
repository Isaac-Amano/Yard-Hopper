import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewListing = () => {
  const { id } = useParams(); // Get the listing ID from the URL
  const dispatch = useDispatch();
  const listing = useSelector((state) => state.listings.currentListing); // Replace with your actual state slice

  useEffect(() => {
    if (id) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id }); // Fetch the specific listing by ID
    }
  }, [dispatch, id]);

  if (!listing) return <div>Please wait</div>; 

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>Location: {listing.city}, {listing.state}</p>
      {/* Additional details about the listing */}
    </div>
  );
};

export default ViewListing;
