import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewListing = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const listing = useSelector(state => state.currentListing); 

  // Fetch the listing by ID from the URL
  useEffect(() => {
    console.log("Listing ID from URL:", id); // Ensure we are getting the correct ID from URL
    if (id) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id });
    }
  }, [dispatch, id]);

  // Debugging: Log the listing data after it's fetched
  useEffect(() => {
    console.log("Fetched listing data:", listing); 
  }, [listing]);

  return (
    <div>
      {listing ? (
        <>
          <h2>{listing.title}</h2>
          <p>{listing.description}</p>
          <p>{listing.city}, {listing.state}</p>
          {/* Google Maps integration */}
          {/* <div style={{ height: '400px', width: '100%' }}>
            {listing.latitude && listing.longitude ? (
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
                defaultCenter={{ lat: listing.latitude, lng: listing.longitude }}
                defaultZoom={11}
              >
                <div lat={listing.latitude} lng={listing.longitude}>
                  {listing.title}
                </div>
              </GoogleMapReact>
            ) : (
              <p>Location data not available</p>
            )}
          </div> */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewListing;

