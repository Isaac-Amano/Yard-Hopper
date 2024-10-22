import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

const EditListing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams(); 
  const userListings = useSelector((state) => state.userListings);

  
  const listingToEdit = userListings.find(listing => listing.id === parseInt(id));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
  });

  
  useEffect(() => {
    if (listingToEdit) {
      setFormData({
        title: listingToEdit.title,
        description: listingToEdit.description,
        phone_number: listingToEdit.phone_number,
        address: listingToEdit.address,
        city: listingToEdit.city,
        state: listingToEdit.state,
      });
    }
  }, [listingToEdit]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch({
      type: 'UPDATE_LISTING',
      payload: { id, ...formData },
    });

    history.push('/mylistings');
  };

  if (!listingToEdit) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Edit Listing</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditListing;
