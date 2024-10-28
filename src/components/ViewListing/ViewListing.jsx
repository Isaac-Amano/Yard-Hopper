import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';

const ViewListing = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Updated to use Vite-compatible environment variable
  const listing = useSelector((state) => state.currentListing);
  const [coordinates, setCoordinates] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (listing) {
        const address = `${listing.address}, ${listing.city}, ${listing.state}`;
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          console.log("Geocode response:", data); // Debugging line

          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setCoordinates({ lat: location.lat, lng: location.lng });
          } else {
            console.error('Geocoding failed: No results found');
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      }
    };
    geocodeAddress();
  }, [listing, GOOGLE_MAPS_API_KEY]); // Ensure the key is part of the dependency array

  if (!listing) return <div>Loading listing...</div>;

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>Location: {listing.city}, {listing.state}</p>

      {/* Contact Seller Button */}
      <button onClick={() => setShowContact(!showContact)}>
        {showContact ? 'Hide Contact Info' : 'Contact Seller'}
      </button>
      {showContact && <p>Phone: {listing.phone_number}</p>}

      <div style={{ height: '400px', width: '100%' }}>
        {coordinates ? (
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
            center={coordinates}
            defaultZoom={10}
          >
            <div lat={coordinates.lat} lng={coordinates.lng}>
              📍
            </div>
          </GoogleMapReact>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default ViewListing;
