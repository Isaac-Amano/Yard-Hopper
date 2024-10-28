import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';

const ViewListing = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Vite environment variable
  const listing = useSelector((state) => state.currentListing);
  const [coordinates, setCoordinates] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (listing && listing.address && listing.city && listing.state) {
        const address = `${listing.address}, ${listing.city}, ${listing.state}`;
        console.log("Address used for geocoding:", address); // Debugging line

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
      } else {
        console.warn('Listing address is incomplete or missing.');
        // Optionally set a default location (example coordinates for NYC)
        setCoordinates({ lat: 40.7128, lng: -74.0060 });
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
