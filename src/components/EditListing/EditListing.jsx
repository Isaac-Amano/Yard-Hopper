import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const EditListing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const listing = useSelector((state) => state.currentListing);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (!listing || listing.id !== parseInt(id)) {
      dispatch({ type: 'FETCH_SINGLE_LISTING', payload: id });
    } else {
      setTitle(listing.title || '');
      setDescription(listing.description || '');
      setAddress(listing.address || '');
      setCity(listing.city || '');
      setState(listing.state || '');
      setPhoneNumber(listing.phone_number || '');
      setImageUrls([
        listing.image_url_1 || '',
        listing.image_url_2 || '',
        listing.image_url_3 || ''
      ]);
    }
  }, [listing, id, dispatch]);

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
      type: 'UPDATE_LISTING',
      payload: {
        id,
        title,
        description,
        image_url_1: imageUrls[0],
        image_url_2: imageUrls[1],
        image_url_3: imageUrls[2],
        phone_number: phoneNumber,
        address,
        city,
        state,
      },
    });
    history.push('/mylistings');
  };

  // Inline CSS for the component
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: '#00acb0',
      boxShadow: '0 0 5px rgba(0, 172, 176, 0.3)',
      outline: 'none',
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#00acb0',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#00757b',
    },
    imageUpload: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    imagePreview: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '6px',
      marginTop: '10px',
      border: '1px solid #ddd',
    },
    backButton: {
      marginBottom: '20px',
      backgroundColor: 'transparent',
      color: '#00acb0',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => history.push('/mylistings')}
        style={styles.backButton}
      >
        &larr; Back to My Listings
      </button>
      <h2 style={styles.header}>Edit Listing</h2>
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
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />

        {[0, 1, 2].map((index) => (
          <div style={styles.imageUpload} key={index}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
              style={styles.input}
            />
            {imageUrls[index] && (
              <img
                src={imageUrls[index]}
                alt={`Uploaded ${index + 1}`}
                style={styles.imagePreview}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(styles.buttonHover && { ':hover': styles.buttonHover }),
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditListing;
