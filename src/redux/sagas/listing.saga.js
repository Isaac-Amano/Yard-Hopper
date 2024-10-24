import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
// import EditListing from '../../components/EditListing/EditListing';

function* deleteListing(action) {
  try {
    const listingId = action.payload; 
    console.log(`Deleting listing with ID: ${listingId}`);  

    yield axios.delete(`/api/listings/${listingId}`);

    console.log('Listing deleted successfully');
    
    // After successfully deleting, fetch the updated user listings
    yield put({ type: 'FETCH_USER_LISTINGS' });
  } catch (error) {
    console.error('Error deleting listing:', error);
  }
}

function* updateListing(action) {
  try {
    const { id, ...updatedListing } = action.payload; // Extract the ID and the updated listing data
    yield axios.put(`/api/listings/${id}`, updatedListing);
    console.log('Edit listing successful');
    yield put({ type: 'FETCH_USER_LISTINGS' }); // Fetch updated listings after editing
  } catch (error) {
    console.error('Error updating listing:', error);
  }
}
// Saga to handle fetching user listings
function* fetchListings() {
  try {
    console.log('Fetching user listings');
    
    // Fetch the user's listings from the server
    const response = yield axios.get('/api/listings/mylistings');  
    console.log('User Listings:', response.data);

    // Dispatch the action to update the state with the fetched listings
    yield put({ type: 'SET_USER_LISTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
}

// Saga to handle adding a new listing goes here 
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


//  this saga is for the initial listings page to fetch all listings, not working tho
function* fetchAllListings() {
  try {
    console.log('Fetching all listings'); // Add a log here
    const response = yield axios.get('/api/listings/');
    console.log('Listings fetched:', response.data); // Confirm listings are fetched
    yield put({ type: 'SET_LISTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching all listings:', error);
  }
}

function* fetchSingleListing(action) {
  try {
    console.log('Fetching single listing with ID:', action.payload); // 
    const response = yield axios.get(`/api/listings/${action.payload}`); // Fetch single listing 
    console.log('Single listing response:', response.data); 
    yield put({ type: 'SET_SINGLE_LISTING', payload: response.data });  // Store the result in Redux
  } catch (error) {
    console.error('Error fetching single listing:', error);
  }
}

// Root saga goes below, dont forget to add fetch_singke_listing!!!!
function* listingsSaga() {
  
  yield takeLatest('FETCH_USER_LISTINGS', fetchListings);

  yield takeLatest('ADD_LISTING', addListing);

  yield takeLatest('DELETE_LISTING', deleteListing);

  yield takeLatest('UPDATE_LISTING', updateListing);

  yield takeLatest('FETCH_ALL_LISTINGS', fetchAllListings);

  yield takeLatest('FETCH_SINGLE_LISTING', fetchSingleListing); 
}

export default listingsSaga;
