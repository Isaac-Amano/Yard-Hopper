import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const AddListing = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    dispatch({
      type: 'ADD_LISTING',
      payload: 
      { title,
         description, 
         image_url, 
         phone_number, 
         address, 
         city, 
        state }
    });
    // need a code here to clear input fields once subm,itted
    setTitle('');
    setDescription('');
    setImageUrl('');
    setPhoneNumber('');
    setAddress('');
    setCity('');
    setState('');

    setSuccessMessage('Listing added!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 400);
    // history.push('/mylistings')

  };

  return (
    <div>
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
        <input 
          type="text"
          placeholder="Image URL"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input 
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input 
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
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
