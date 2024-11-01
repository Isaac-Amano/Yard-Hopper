import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga to handle fetching all listings with an optional search term
function* fetchAllListings(action) {
  try {
    const searchTerm = action.payload || '';  // Extract search term if provided
    const response = yield axios.get(`/api/listings?search=${searchTerm}`);  // Fetch all listings with search term
    yield put({ type: 'SET_LISTINGS', payload: response.data });  // Dispatch action to set all listings in Redux state
  } catch (error) {
    console.error('Error fetching all listings:', error);
  }
}

// Saga to handle fetching a single listing by ID
function* fetchSingleListing(action) {
  console.log("Fetching listing with ID:", action.payload);  // Debugging line
  try {
    const response = yield axios.get(`/api/listings/getbyid/${action.payload}`);
    yield put({ type: 'SET_SINGLE_LISTING', payload: response.data });
  } catch (error) {
    console.error('Error fetching single listing on saga:', error);
  }
}

// Saga to handle fetching user-specific listings
function* fetchUserListing() {
  console.log('Fetching user-specific listings');
  try {
    const response = yield axios.get('/api/listings/mylistings');  // API call to fetch user's listings
    yield put({ type: 'SET_USER_LISTINGS', payload: response.data });  // Dispatch to set user listings in Redux
  } catch (error) {
    console.error('Error fetching user listings in saga:', error);
  }
}

// Saga to handle adding a new listing
function* addListing(action) {
  try {
    yield axios.post('/api/listings', action.payload);  // Post new listing data
    yield put({ type: 'FETCH_ALL_LISTINGS' });  // Refresh all listings after adding a new one
  } catch (error) {
    console.error('Error adding listing:', error);
  }
}

// Saga to handle updating a listing
// *************
// The payload for UPDATE_LISTING action in EditListing.jsx is not properly populated with the listing data. this is my issue **********

function* updateListing(action) {
  try {
    const { id, ...updatedListing } = action.payload;  // 
    console.log("Updating listing with ID:", id);  
    console.log("Updated Listing Payload:", updatedListing); 
    yield axios.put(`/api/listings/${id}`, updatedListing); 
    yield put({ type: 'FETCH_ALL_LISTING' });  // this is the issue 
  } catch (error) {
    console.error('Error updating listing:', error);
  }
}

// Saga to handle deleting a listing
function* deleteListing(action) {
  try {
    const listingId = action.payload;
    yield axios.delete(`/api/listings/${listingId}`);  // API call to delete the listing
    yield put({ type: 'FETCH_USER_LISTINGS' });  // Fetch updated list of user's listings after deletion
  } catch (error) {
    console.error('Error deleting listing:', error);
  }
}

// Root saga to watch for listing-related actions
function* listingsSaga() {
  yield takeLatest('FETCH_ALL_LISTINGS', fetchAllListings);  // Watch for fetching all listings
  yield takeLatest('FETCH_SINGLE_LISTING', fetchSingleListing);  // Watch for fetching a single listing by ID
  yield takeLatest('ADD_LISTING', addListing);  // Watch for adding a new listing
  yield takeLatest('UPDATE_LISTING', updateListing);  // Watch for updating a listing
  yield takeLatest('DELETE_LISTING', deleteListing);  // Watch for deleting a listing
  yield takeLatest('FETCH_USER_LISTINGS', fetchUserListing);  // Watch for fetching user-specific listings
}

export default listingsSaga;
