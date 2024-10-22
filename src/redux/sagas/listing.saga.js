import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga to handle deleting a listing
function* deleteListing(action) {
  try {
    const listingId = action.payload; // The ID of the listing to delete
    console.log(`Deleting listing with ID: ${listingId}`);  // Log the listing ID being sent

    // Perform the DELETE request to remove the listing
    yield axios.delete(`/api/listings/${listingId}`);

    console.log('Listing deleted successfully');
    
    // After successfully deleting, fetch the updated user listings
    yield put({ type: 'FETCH_USER_LISTINGS' });
  } catch (error) {
    console.error('Error deleting listing:', error);
  }
}

// Saga to handle fetching user listings
function* fetchListings() {
  try {
    console.log('Fetching user listings');
    
    // Fetch the user's listings from the server
    const response = yield axios.get('/api/listings/mylistings');  // Ensure yield and axios.get are on the same line
    console.log('User Listings:', response.data);

    // Dispatch the action to update the state with the fetched listings
    yield put({ type: 'SET_USER_LISTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
}

// Saga to handle adding a new listing
function* addListing(action) {
  try {
    // Send the listing data to the server
    const response = yield axios.post('/api/listings', action.payload);
    
    // After successfully adding, fetch all user listings again
    yield put({ type: 'FETCH_USER_LISTINGS' });
  } catch (error) {
    console.error('Error adding listing:', error);
  }
}

// Root saga to watch for relevant actions
function* listingsSaga() {
  // Watch for the 'FETCH_LISTINGS' action to fetch user listings
  yield takeLatest('FETCH_USER_LISTINGS', fetchListings);

  // Watch for the 'ADD_LISTING' action to add a new listing
  yield takeLatest('ADD_LISTING', addListing);

  // Watch for the 'DELETE_LISTING' action to delete a listing
  yield takeLatest('DELETE_LISTING', deleteListing);
}

export default listingsSaga;
