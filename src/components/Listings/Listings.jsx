// src/components/Listings/Listings.jsx

import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './listings.css';

const containerStyle = {
  width: '70%',
  height: '80vh',
};

const center = {
  lat: 44.9778, // Default center
  lng: -93.2650,
};

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);
  const [selectedListing, setSelectedListing] = useState(null);
  const [coordinates, setCoordinates] = useState({}); // Store coordinates of each listing
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_LISTINGS' }); // Fetch all listings initially
  }, [dispatch]);

  // Geocode each listing's address if coordinates are missing
  useEffect(() => {
    const fetchCoordinates = async () => {
      for (let listing of listings) {
        if (!listing.latitude || !listing.longitude) {
          const address = `${listing.address}, ${listing.city}, ${listing.state}`;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
              )}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              const location = data.results[0].geometry.location;
              setCoordinates((prevCoords) => ({
                ...prevCoords,
                [listing.id]: { lat: location.lat, lng: location.lng },
              }));
            } else {
              console.error(`Geocoding failed for address: ${address}`);
            }
          } catch (error) {
            console.error('Error fetching coordinates:', error);
          }
        } else {
          setCoordinates((prevCoords) => ({
            ...prevCoords,
            [listing.id]: { lat: parseFloat(listing.latitude), lng: parseFloat(listing.longitude) },
          }));
        }
      }
    };

    if (listings.length > 0) {
      fetchCoordinates();
    }
  }, [listings, GOOGLE_MAPS_API_KEY]);

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
        {listings.map((listing) => {
          const coord = coordinates[listing.id];
          if (coord) {
            return (
              <Marker
                key={listing.id}
                position={coord}
                onClick={() => setSelectedListing(listing)}
              />
            );
          }
          return null; // Skip if coordinates are not yet available
        })}

        {selectedListing && (
          <InfoWindow
            position={{
              lat: coordinates[selectedListing.id].lat,
              lng: coordinates[selectedListing.id].lng,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div>
              <h4>{selectedListing.title}</h4>
              <p>{selectedListing.address}, {selectedListing.city}, {selectedListing.state}</p>
              <Link to={`/listings/${selectedListing.id}`}>See Details</Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Listings;
