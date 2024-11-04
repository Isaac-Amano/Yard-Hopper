import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import './ViewListing.css';

const ViewListing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const listing = useSelector((state) => state.currentListing);
  const [coordinates, setCoordinates] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id });
    }
  }, [dispatch, id]);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (listing && listing.address && listing.city && listing.state) {
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
            setCoordinates({ lat: location.lat, lng: location.lng });
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      }
    };
    geocodeAddress();
  }, [listing, GOOGLE_MAPS_API_KEY]);

  if (!listing) return <div>Loading listing...</div>;

  const imageUrls = [listing.image_url_1, listing.image_url_2, listing.image_url_3].filter(Boolean);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="view-listing">
      <button onClick={() => history.push('/listings')} className="back-button">
        &larr; Back to Listings
      </button>
      
      <div className="card image-card">
        <h2 className="listing-title">{listing.title || "No Title Available"}</h2>

        <div className="image-slider">
          {imageUrls.length > 0 ? (
            <>
              <button className="slider-button prev" onClick={handlePrevImage}>&#10094;</button>
              <img src={imageUrls[currentImageIndex]} alt="Listing" className="slider-image" />
              <button className="slider-button next" onClick={handleNextImage}>&#10095;</button>
            </>
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>
      </div>

      <div className="card description-card">
        <p className="listing-description">{listing.description || "No Description Available"}</p>
        <p className="listing-posted-date">Posted on: {formatDate(listing.created_at)}</p>
        <p className="listing-location">
          Location: {listing.address || "Address not provided"}, {listing.city || "City not provided"}, {listing.state || "State not provided"}
        </p>
        <button onClick={() => setShowContact(!showContact)} className="contact-button">
          {showContact ? 'Hide Contact Info' : 'Contact Seller'}
        </button>
        {showContact && <p className="contact-info">Phone: {listing.phone_number || "Phone number not available"}</p>}
      </div>

      <div className="card map-card">
        <h3 className="map-title">Location</h3>
        {coordinates ? (
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
            center={coordinates}
            defaultZoom={15}
          >
            <div lat={coordinates.lat} lng={coordinates.lng} className="map-marker">
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
