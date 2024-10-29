import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const EditListing = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the listing ID from the URL
  const history = useHistory();

  const listings = useSelector((state) => state.userListings);
  const listingToEdit = listings.find((listing) => listing.id === Number(id));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
  });

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
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

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place) {
      setFormData({
        ...formData,
        address: place.formatted_address || "",
        city: place.address_components.find((comp) => comp.types.includes("locality"))?.long_name || '',
        state: place.address_components.find((comp) => comp.types.includes("administrative_area_level_1"))?.short_name || '',
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: 'UPDATE_LISTING',
      payload: { id, ...formData },
    });
    history.push('/mylistings');
  };

  if (!isLoaded) return <div>Loading...</div>;

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
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
        </Autocomplete>
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
