import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga to fetch listings from the server
function* fetchListings() {
  try {
    console.log('Fetching listings');
    const response = yield axios.get('/api/listings/mylistings');  // Make sure yield is on the same line as axios.get
    console.log('Listings:', response.data);
    yield put({ type: 'SET_USER_LISTINGS', payload: response.data });  // Fixed action type
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
}

function* addListing(action) {
  try {
    const response = yield axios.post('/api/listings', action.payload);
    yield put({ type: 'FETCH_LISTINGS' });  // Fetch all listings after adding a new one
  } catch (error) {
    console.error('Error adding listing:', error);
  }
}

function* listingsSaga() {
  yield takeLatest('FETCH_LISTINGS', fetchListings);  // Watch for FETCH_LISTINGS action
  yield takeLatest('ADD_LISTING', addListing);  // Watch for ADD_LISTING action
}

export default listingsSaga;
