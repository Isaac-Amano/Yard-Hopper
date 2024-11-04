// src/components/Listings/Listings.jsx

import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './listings.css';

const center = {
  lat: 44.9778, // Default center
  lng: -93.2650,
};

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);
  const [selectedListing, setSelectedListing] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_LISTINGS' });
  }, [dispatch]);

  useEffect(() => {
    // Convert address to coordinates for each listing
    const fetchCoordinates = async () => {
      const newCoordinates = {};
      for (const listing of listings) {
        if (listing.latitude && listing.longitude) {
          newCoordinates[listing.id] = {
            lat: parseFloat(listing.latitude),
            lng: parseFloat(listing.longitude),
          };
        } else if (listing.address && listing.city && listing.state) {
          // Fetch coordinates if not available
          const address = `${listing.address}, ${listing.city}, ${listing.state}`;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              const location = data.results[0].geometry.location;
              newCoordinates[listing.id] = { lat: location.lat, lng: location.lng };
            }
          } catch (error) {
            console.error('Error fetching coordinates:', error);
          }
        }
      }
      setCoordinates(newCoordinates);
    };

    if (listings.length > 0) {
      fetchCoordinates();
    }
  }, [listings, GOOGLE_MAPS_API_KEY]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      dispatch({ type: 'FETCH_FILTERED_LISTINGS', payload: searchTerm });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch({ type: 'FETCH_ALL_LISTINGS' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="listings-page">
      {/* Sidebar for listings */}
      <div className="listings-sidebar">
        <div className="sidebar-header">
          <h2>Garage Sales Near You</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Enter location or keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={clearSearch} className="clear-button">Clear</button>
          </div>
        </div>
        
        <div className="listing-cards-container">
          {listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div className="listing-image">
                {listing.image_url_1 ? (
                  <img src={listing.image_url_1} alt={listing.title} />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </div>
              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p>{listing.address}, {listing.city}, {listing.state}</p>
                <p>Posted on: {formatDate(listing.created_at)}</p>
                <Link to={`/listings/${listing.id}`} className="details-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={10}>
          {Object.entries(coordinates).map(([id, coord]) => (
            <Marker
              key={id}
              position={coord}
              onClick={() => setSelectedListing(listings.find((listing) => listing.id === parseInt(id)))}
            />
          ))}

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
    </div>
  );
};

export default Listings;
