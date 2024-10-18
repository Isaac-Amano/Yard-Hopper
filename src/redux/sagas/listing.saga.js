import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga to fetch listings from the server
function* fetchListings() {
  try {

    console.log('Fetching listings')
    const response = yield 
    axios.get('/api/listings/mylistings');
    console.log('Listings ', response.data);
    yield put({ type: 'SET__USER_LISTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
}
function* addListing(action) {
    try {
      const response = yield axios.post('/api/listings', action.payload);
      // Optionally, you can fetch listings again after adding
      yield put({ type: 'FETCH_LISTINGS' });
    } catch (error) {
      console.error('Error adding listing:', error);
    }
  }
  
// this is for my Watcher saga to look for FETCH_LISTINGS actions
function* listingsSaga() {
  yield takeLatest('FETCH_LISTINGS', fetchListings);
}

export default listingsSaga;
