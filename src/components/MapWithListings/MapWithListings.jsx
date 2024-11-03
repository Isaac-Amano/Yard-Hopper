// // src/components/MapWithListings/MapWithListings.jsx

// import React, { useEffect, useState } from 'react';
// import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import './MapWithListings.css';

// const containerStyle = {
//   width: '100%',
//   height: '400px',
// };

// const center = {
//   lat: 44.9778, // Default to a central point
//   lng: -93.2650, // Add longitude for Minneapolis center
// };

// const MapWithListings = () => {
//   const dispatch = useDispatch();
//   const listings = useSelector((state) => state.listings);
//   const [selectedListing, setSelectedListing] = useState(null);

//   // Load Google Maps API with API key
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Adjusted for Vite setup if needed
//   });

//   useEffect(() => {
//     // Fetch all listings initially
//     dispatch({ type: 'FETCH_ALL_LISTINGS' });
//   }, [dispatch]);

//   useEffect(() => {
//     // Log the listings to verify coordinates
//     console.log("Listings Data:", listings);
//   }, [listings]);

//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div className="map-listings-container">
//       {/* Google Map */}
//       <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
//         {listings.map((listing) => {
//           // Check if latitude and longitude are valid numbers
//           const lat = parseFloat(listing.latitude);
//           const lng = parseFloat(listing.longitude);
          
//           if (isNaN(lat) || isNaN(lng)) {
//             console.warn(`Invalid coordinates for listing "${listing.title}"`);
//             return null;
//           }

//           return (
//             <Marker
//               key={listing.id}
//               position={{ lat, lng }}
//               onClick={() => setSelectedListing(listing)}
//             />
//           );
//         })}

//         {selectedListing && (
//           <InfoWindow
//             position={{
//               lat: parseFloat(selectedListing.latitude),
//               lng: parseFloat(selectedListing.longitude),
//             }}
//             onCloseClick={() => setSelectedListing(null)}
//           >
//             <div>
//               <h4>{selectedListing.title}</h4>
//               <p>{selectedListing.address}, {selectedListing.city}, {selectedListing.state}</p>
//               <Link to={`/listings/${selectedListing.id}`}>See Details</Link>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
      
//       {/* Sidebar with Listings */}
//       <div className="listings-sidebar">
//         <h2>Garage Sales Near You</h2>
//         {listings.map((listing) => (
//           <div key={listing.id} className="listing-item">
//             <h3>{listing.title}</h3>
//             <p>{listing.address}, {listing.city}, {listing.state}</p>
//             <Link to={`/listings/${listing.id}`} className="details-button">
//               See Details
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MapWithListings;
