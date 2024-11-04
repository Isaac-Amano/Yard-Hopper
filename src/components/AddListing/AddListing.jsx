import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './AddListing.css';


const libraries = ["places"];

const AddListing = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '']); // Array to store up to 3 image URLs
  const [phone_number, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place) {
      setAddress(place.formatted_address || "");
      const components = place.address_components;
      const cityComponent = components.find((comp) => comp.types.includes("locality"));
      const stateComponent = components.find((comp) => comp.types.includes("administrative_area_level_1"));
      setCity(cityComponent ? cityComponent.long_name : '');
      setState(stateComponent ? stateComponent.short_name : '');
    }
  };

  const handleImageUpload = async (event, index) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    
    try {
      console.log('Uploading image...');
      const response = await axios.post('/api/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Response from server:', response.data);
  
      const updatedImageUrls = [...imageUrls];
      updatedImageUrls[index] = response.data.url; // Set the URL at the correct index
      setImageUrls(updatedImageUrls); // Update the state with the new image URL
      console.log(`Uploaded image ${index + 1} URL:`, response.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch({
      type: 'ADD_LISTING',
      payload: {
        title,
        description,
        image_url_1: imageUrls[0],
        image_url_2: imageUrls[1],
        image_url_3: imageUrls[2],
        phone_number,
        address,
        city,
        state,
      },
    });

    setSuccessMessage('Listing added!');
    setTimeout(() => {
      setSuccessMessage('');
      history.push('/listings'); // Redirect to the listings page after submission
    }, 500);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => history.push('/listings')} style={{ marginBottom: '20px' }}>
        &larr; Back to Listings
      </button>
      <h2>Add a New Listing</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
            />
            {imageUrls[index] && (
              <img src={imageUrls[index]} alt={`Uploaded ${index + 1}`} style={{ width: '100px', marginTop: '10px' }} />
            )}
          </div>
        ))}
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Autocomplete>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <button type="submit">Add Listing</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default AddListing;
