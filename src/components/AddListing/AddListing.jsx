import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const libraries = ["places"];

const AddListing = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '']);
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
      const response = await axios.post('/api/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedImageUrls = [...imageUrls];
      updatedImageUrls[index] = response.data.url;
      setImageUrls(updatedImageUrls);
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
      history.push('/listings');
    }, 500);
  };

  if (!isLoaded) return <div>Loading...</div>;

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    backButton: {
      marginBottom: '20px',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
    },
    backButtonHover: {
      backgroundColor: '#388e3c',
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    inputFocus: {
      borderColor: '#4caf50',
      boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)',
    },
    submitButton: {
      padding: '12px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    submitButtonHover: {
      backgroundColor: '#388e3c',
      transform: 'scale(1.02)',
    },
    imageUploadContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    imagePreview: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginTop: '10px',
    },
    successMessage: {
      textAlign: 'center',
      color: '#4caf50',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => history.push('/listings')}
        style={styles.backButton}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.backButtonHover.backgroundColor)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.backButton.backgroundColor)}
      >
        &larr; Back to Listings
      </button>
      <h2 style={styles.title}>Add a New Listing</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.input}
        />
        {[0, 1, 2].map((index) => (
          <div key={index} style={styles.imageUploadContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
              style={styles.input}
            />
            {imageUrls[index] && (
              <img src={imageUrls[index]} alt={`Uploaded ${index + 1}`} style={styles.imagePreview} />
            )}
          </div>
        ))}
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />
        <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={styles.input}
          />
        </Autocomplete>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.submitButton}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor)}
        >
          Add Listing
        </button>
      </form>
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
    </div>
  );
};

export default AddListing;
