import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';

const ViewListing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const listing = useSelector((state) => state.currentListing);

  const [mapCenter, setMapCenter] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  useEffect(() => {
    if (id) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (listing) {
      const { address, city, state } = listing;
      const fullAddress = `${address}, ${city}, ${state}`;

      // Fetch coordinates from Google Geocoding API
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=YOUR_GOOGLE_MAPS_API_KEY`
          );

          const location = response.data.results[0].geometry.location;
          setMapCenter({ lat: location.lat, lng: location.lng });
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      };

      fetchCoordinates();
    }
  }, [listing]);

  if (!isLoaded) return <div>Loading Maps...</div>;
  if (!listing) return <div>Loading listing...</div>;

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>Location: {listing.city}, {listing.state}</p>

      {mapCenter && (
        <GoogleMap
          center={mapCenter}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '400px' }}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      )}
    </div>
  );
};

export default ViewListing;
