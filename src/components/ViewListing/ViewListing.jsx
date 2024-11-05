import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';

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

  const styles = {
    viewListing: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    backButton: {
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      border: 'none',
      fontWeight: 'bold',
      marginBottom: '20px',
      transition: 'background-color 0.3s ease',
    },
    card: {
      backgroundColor: '#fff',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    imageSlider: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    sliderImage: {
      width: '100%',
      height: '300px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    sliderButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      border: 'none',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '18px',
      borderRadius: '50%',
    },
    prevButton: {
      left: '10px',
    },
    nextButton: {
      right: '10px',
    },
    description: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '15px',
    },
    location: {
      fontSize: '16px',
      color: '#555',
    },
    contactButton: {
      backgroundColor: '#5dade2',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      marginTop: '15px',
    },
    contactButtonHover: {
      backgroundColor: '#3498db',
      transform: 'scale(1.05)',
    },
    mapContainer: {
      height: '300px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '15px',
    },
    mapMarker: {
      fontSize: '24px',
    },
  };

  return (
    <div style={styles.viewListing}>
      <button
        onClick={() => history.push('/listings')}
        style={styles.backButton}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#388e3c')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4caf50')}
      >
        &larr; Back to Listings
      </button>

      <div style={{ ...styles.card, ...styles.imageCard }}>
        <h2 style={styles.title}>{listing.title || "No Title Available"}</h2>

        <div style={styles.imageSlider}>
          {imageUrls.length > 0 ? (
            <>
              <button
                style={{ ...styles.sliderButton, ...styles.prevButton }}
                onClick={handlePrevImage}
              >
                &#10094;
              </button>
              <img src={imageUrls[currentImageIndex]} alt="Listing" style={styles.sliderImage} />
              <button
                style={{ ...styles.sliderButton, ...styles.nextButton }}
                onClick={handleNextImage}
              >
                &#10095;
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>No Image Available</div>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <p style={styles.description}>{listing.description || "No Description Available"}</p>
        <p>Posted on: {formatDate(listing.created_at)}</p>
        <p style={styles.location}>
          Location: {listing.address || "Address not provided"}, {listing.city || "City not provided"}, {listing.state || "State not provided"}
        </p>
        <button
          onClick={() => setShowContact(!showContact)}
          style={styles.contactButton}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.contactButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5dade2')}
        >
          {showContact ? 'Hide Contact Info' : 'Contact Seller'}
        </button>
        {showContact && (
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Phone: {listing.phone_number || "Phone number not available"}
          </p>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.title}>Location</h3>
        <div style={styles.mapContainer}>
          {coordinates ? (
            <GoogleMapReact
              bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
              center={coordinates}
              defaultZoom={15}
            >
              <div lat={coordinates.lat} lng={coordinates.lng} style={styles.mapMarker}>
                📍
              </div>
            </GoogleMapReact>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewListing;
