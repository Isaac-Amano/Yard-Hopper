import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';

const ViewListing = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const listing = useSelector((state) => state.currentListing);
  const [coordinates, setCoordinates] = useState(null);
  const [showContact, setShowContact] = useState(false);

  // Dispatch action to fetch the specific listing by ID
  useEffect(() => {
    if (id) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id });
    }
  }, [dispatch, id]);

  // Geocode the listing address when the listing data is available
  useEffect(() => {
    const geocodeAddress = async () => {
      if (listing && listing.address && listing.city && listing.state) {
        const address = `${listing.address}, ${listing.city}, ${listing.state}`;
        console.log("Address used for geocoding:", address);

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${GOOGLE_MAPS_API_KEY}`
          );

          const data = await response.json();
          console.log("Geocode response:", data);

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
      }
    };

    geocodeAddress();
  }, [listing, GOOGLE_MAPS_API_KEY]);

  if (!listing) return <div>Loading listing...</div>;

  return (
    <div>
      <h2>{listing.title || "No Title Available"}</h2>

      {/* Display images if they exist */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {listing.image_url_1 && (
          <img src={listing.image_url_1} alt="Listing Image 1" style={{ width: '200px', height: 'auto' }} />
        )}
        {listing.image_url_2 && (
          <img src={listing.image_url_2} alt="Listing Image 2" style={{ width: '200px', height: 'auto' }} />
        )}
        {listing.image_url_3 && (
          <img src={listing.image_url_3} alt="Listing Image 3" style={{ width: '200px', height: 'auto' }} />
        )}
      </div>

      <p>{listing.description || "No Description Available"}</p>
      <p>
        Location: {listing.address || "Address not provided"}, {listing.city || "City not provided"}, {listing.state || "State not provided"}
      </p>

      {/* Contact Seller Button */}
      <button onClick={() => setShowContact(!showContact)}>
        {showContact ? 'Hide Contact Info' : 'Contact Seller'}
      </button>
      {showContact && <p>Phone: {listing.phone_number || "Phone number not available"}</p>}

      <div style={{ height: '400px', width: '100%' }}>
        {coordinates ? (
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
            center={coordinates}
            defaultZoom={15}
          >
            {/* Marker */}
            <div lat={coordinates.lat} lng={coordinates.lng} style={{ color: 'red', fontSize: '51px' }}>
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
