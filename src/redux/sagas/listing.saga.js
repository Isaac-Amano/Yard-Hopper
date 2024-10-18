import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga to fetch listings from the server
function* fetchListings() {
  try {
    const response = yield axios.get('/api/listings');
    yield put({ type: 'SET_LISTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
}

// this is for my Watcher saga to look for FETCH_LISTINGS actions
function* listingsSaga() {
  yield takeLatest('FETCH_LISTINGS', fetchListings);
}

export default listingsSaga;
