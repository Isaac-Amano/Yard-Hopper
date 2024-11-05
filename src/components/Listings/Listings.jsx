import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const center = {
  lat: 44.9778,
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
    const fetchCoordinates = async () => {
      const newCoordinates = {};
      for (const listing of listings) {
        if (listing.latitude && listing.longitude) {
          newCoordinates[listing.id] = {
            lat: parseFloat(listing.latitude),
            lng: parseFloat(listing.longitude),
          };
        } else if (listing.address && listing.city && listing.state) {
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

  const styles = {
    listingsPage: {
      display: 'flex',
      height: '100vh',
    },
    sidebar: {
      width: '30%',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      overflowY: 'scroll',
      boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
    },
    sidebarHeader: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    searchBar: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },
    searchInput: {
      flex: 1,
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ddd',
    },
    searchButton: {
      padding: '10px 15px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    searchButtonHover: {
      backgroundColor: '#388e3c',
    },
    clearButton: {
      backgroundColor: 'darkgrey',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    listingCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '15px',
      marginBottom: '15px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      width: '100%',
    },
    listingCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
    },
    listingImage: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '6px',
    },
    listingInfo: {
      fontSize: '14px',
      color: '#555',
      padding: '10px 0',
    },
    viewDetailsButton: {
      display: 'inline-block',
      padding: '8px 12px',
      backgroundColor: '#008C94',
      color: 'white',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 'bold',
      marginTop: '10px',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      textAlign: 'center',
    },
    viewDetailsButtonHover: {
      backgroundColor: '#00757b',
      transform: 'scale(1.05)',
    },
    mapContainer: {
      flex: 1,
    },
  };

  return (
    <div style={styles.listingsPage}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2>Garage Sales Near You</h2>
          <div style={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Enter location or keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <button 
              onClick={handleSearch}
              style={styles.searchButton}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.searchButtonHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.searchButton.backgroundColor)}
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              style={styles.clearButton}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="listing-cards-container">
          {listings.map((listing) => (
            <div
              key={listing.id}
              style={styles.listingCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.listingCardHover.transform;
                e.currentTarget.style.boxShadow = styles.listingCardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div>
                {listing.image_url_1 ? (
                  <img src={listing.image_url_1} alt={listing.title} style={styles.listingImage} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#aaa', padding: '10px' }}>No Image Available</div>
                )}
              </div>
              <div style={styles.listingInfo}>
                <h3>{listing.title}</h3>
                <p>{listing.address}, {listing.city}, {listing.state}</p>
                <p>Posted on: {formatDate(listing.created_at)}</p>
                <Link
                  to={`/listings/${listing.id}`}
                  style={styles.viewDetailsButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.viewDetailsButtonHover.backgroundColor;
                    e.currentTarget.style.transform = styles.viewDetailsButtonHover.transform;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = styles.viewDetailsButton.backgroundColor;
                    e.currentTarget.style.transform = '';
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.mapContainer}>
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
              <div style={{ maxWidth: '200px' }}>
                <h4>{selectedListing.title}</h4>
                <p>{selectedListing.address}, {selectedListing.city}, {selectedListing.state}</p>
                {selectedListing.image_url_1 ? (
                  <img
                    src={selectedListing.image_url_1}
                    alt={selectedListing.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '5px',
                      marginTop: '10px'
                    }}
                  />
                ) : (
                  <p style={{ color: '#aaa' }}>No Image Available</p>
                )}
                <Link to={`/listings/${selectedListing.id}`} style={{ display: 'block', marginTop: '10px', color: '#008C94', fontWeight: 'bold' }}>See Details</Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Listings;
