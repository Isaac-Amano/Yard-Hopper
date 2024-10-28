import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewListing = () => {
  const { id } = useParams();  // Get the listing ID from the URL
  const dispatch = useDispatch();
  const listing = useSelector((state) => state.listings.currentListing);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);  // State to toggle phone number display

  useEffect(() => {
    if (id) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id });  // Fetch the specific listing by ID
    }
  }, [dispatch, id]);

  if (!listing) return <div>Loading...</div>;  // Display loading until data is ready

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>Location: {listing.city}, {listing.state}</p>

      {/* Contact Seller Section */}
      <button onClick={() => setShowPhoneNumber(!showPhoneNumber)}>
        {showPhoneNumber ? "Hide Contact" : "Contact Seller"}
      </button>

      {showPhoneNumber && (
        <p>Seller's Phone Number: {listing.phone_number}</p>  // Display phone number if button is clicked
      )}
    </div>
  );
};

export default ViewListing;
