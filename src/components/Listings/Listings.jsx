// src/components/Listings/Listings.jsx

import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './listings.css';

const containerStyle = {
  width: '70%',
  height: '80vh',
};

const center = {
  lat: 44.9778, // Default to a central point, e.g., Minneapolis
  lng: -93.2650,
};

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);
  const [selectedListing, setSelectedListing] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_LISTINGS' }); // Fetch all listings initially
  }, [dispatch]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="listings-page">
      {/* Sidebar for listings */}
      <div className="listings-sidebar">
        <h2>Garage Sales Near You</h2>
        {listings.map((listing) => (
          <div key={listing.id} className="listing-item">
            <h3>{listing.title}</h3>
            <p>{listing.address}, {listing.city}, {listing.state}</p>
            <Link to={`/listings/${listing.id}`} className="details-button">
              See Details
            </Link>
          </div>
        ))}
      </div>

      {/* Map container */}
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{
              lat: parseFloat(listing.latitude), // Ensure your listings have latitude & longitude
              lng: parseFloat(listing.longitude),
            }}
            onClick={() => setSelectedListing(listing)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Listings;
