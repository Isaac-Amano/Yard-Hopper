import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
// import GoogleMapReact from 'google-map-react';

const ViewListing = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const listing = useSelector(state => state.currentListing); 


  useEffect(() => {
    dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id }); // Fetch the specific listing by ID
  }, [dispatch, id]);
  return (
    <div>
      {listing ? (
        <>
          <h2>{listing.title}</h2>
          <p>{listing.description}</p>
          <p>{listing.city}, {listing.state}</p>
          {/* Google Maps integration */}
          <div style={{ height: '400px', width: '100%' }}>
            {/* <GoogleMapReact
              bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
              defaultCenter={{ lat: listing.latitude, lng: listing.longitude }}
              defaultZoom={11}
            >
              <div lat={listing.latitude} lng={listing.longitude}>
                {listing.title}
              </div>
            </GoogleMapReact> */}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewListing;