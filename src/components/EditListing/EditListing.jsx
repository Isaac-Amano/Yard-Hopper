import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

const EditListing = () => {
  const dispatch = useDispatch();
  const { id } = useParams();  // Get the listing ID from the URL
  const history = useHistory();

  const listings = useSelector((state) => state.userListings);
  const listingToEdit = listings.find(listing => listing.id === Number(id));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phone_number: '',
    address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    console.log('Listing to edit:', listingToEdit)
    if (listingToEdit) {
      setFormData({
        title: listingToEdit.title,
        description: listingToEdit.description,
        phone_number: listingToEdit.phone_number,
        address: listingToEdit.address,
        city: listingToEdit.city,
        state: listingToEdit.state
      });
    }
  }, [listingToEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('data coming from:', { id, ...formData });
    // Send updated listing data to the saga
    dispatch({
      type: 'UPDATE_LISTING',
      payload: { id, ...formData }
    });

    // Redirect to my listings page after successful edit
    history.push('/mylistings');
  };

  return (
    <div>
      <h2>Edit Listing</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        <button type="submit">Update Listing</button>
      </form>
    </div>
  );
};

export default EditListing;
