import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


function* fetchAllListings(action) {
  try {
    const searchTerm = action.payload || '';  
    const response = yield axios.get(`/api/listings?search=${searchTerm}`);  
    yield put({ type: 'SET_LISTINGS', payload: response.data });  
  } catch (error) {
    console.error('Error fetching all listings:', error);
  }
}

function* fetchSingleListing(action) {
  console.log("Fetching listing with ID:", action.payload);  
  try {
    const response = yield axios.get(`/api/listings/getbyid/${action.payload}`);
    yield put({ type: 'SET_SINGLE_LISTING', payload: response.data });
  } catch (error) {
    console.error('Error fetching single listing on saga:', error);
  }
}

function* fetchUserListing() {
  console.log('Fetching user-specific listings');
  try {
    const response = yield axios.get('/api/listings/mylistings');  
    yield put({ type: 'SET_USER_LISTINGS', payload: response.data });  
  } catch (error) {
    console.error('Error fetching user listings in saga:', error);
  }
}

function* addListing(action) {
  try {
    yield axios.post('/api/listings', action.payload);  
    yield put({ type: 'FETCH_ALL_LISTINGS' });  
  } catch (error) {
    console.error('Error adding listing:', error);
  }
}

function* updateListing(action) {
  try {
    const { id, ...updatedListing } = action.payload;  
    console.log("Updating listing with ID:", id);  
    console.log("Updated Listing Payload:", updatedListing); 
    yield axios.put(`/api/listings/${id}`, updatedListing); 
    yield put({ type: 'FETCH_ALL_LISTING' });  
  } catch (error) {
    console.error('Error updating listing:', error);
  }
}

function* deleteListing(action) {
  try {
    const listingId = action.payload;
    yield axios.delete(`/api/listings/${listingId}`); 
    yield put({ type: 'FETCH_USER_LISTINGS' });  
  } catch (error) {
    console.error('Error deleting listing:', error);
  }
}

function* fetchFilteredListings(action) {
  try {
    const response = yield axios.get(`/api/listings?search=${action.payload}`);
    yield put({ type: 'SET_LISTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching filtered listings:', error);
  }
}


function* listingsSaga() {
  yield takeLatest('FETCH_ALL_LISTINGS', fetchAllListings);  
  yield takeLatest('FETCH_SINGLE_LISTING', fetchSingleListing); 
  yield takeLatest('ADD_LISTING', addListing); 
  yield takeLatest('UPDATE_LISTING', updateListing);  
  yield takeLatest('DELETE_LISTING', deleteListing);  
  yield takeLatest('FETCH_USER_LISTINGS', fetchUserListing);  
  yield takeLatest('FETCH_FILTERED_LISTINGS', fetchFilteredListings);
}

export default listingsSaga;
