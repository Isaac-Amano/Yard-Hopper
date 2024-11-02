import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const EditListing = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const listing = useSelector((state) => state.currentListing); // Assuming you have current listing in state

  // Initialize form fields, including address, city, state, and image URLs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '']); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  // Array to hold up to 3 image URLs

  // Load existing listing details into form fields on mount
  useEffect(() => {
    if (listing) {

      console.log("Loaded listing from Redux:", listing);

    setTitle(listing.title || '');
    setDescription(listing.description || '');
    setAddress(listing.address || '');
    setCity(listing.city || '');
    setState(listing.state || '');
    setPhoneNumber(listing.phoneNumber || '');
    setImageUrls([listing.image_url_1, listing.image_url_2, listing.image_url_3]);
  }
}, [listing]);


  // Handler for image upload
  const handleImageUpload = async (event, index) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    try {
      const response = await axios.post('/api/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      type: 'UPDATE_LISTING',
      payload: {
        id,
        title,
        description,
        image_url_1: imageUrls[0],
        image_url_2: imageUrls[1],
        image_url_3: imageUrls[2],
        phoneNumber,
        address,
        city,
        state,
      },
    });
  };

  return (
    <div>
      <h2>Edit Listing</h2>
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
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

<input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        
        {/* Image upload inputs */}
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditListing;
