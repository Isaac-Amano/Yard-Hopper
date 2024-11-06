import { combineReducers } from 'redux';
import listingsReducer from './listings.reducer';
import userListingsReducer from './userListings.reducer';
import currentListingReducer from './currentListing.reducer'; 
import userReducer from './user.reducer';
import errorsReducer from './errors.reducer';

const rootReducer = combineReducers({
  listings: listingsReducer,         
  userListings: userListingsReducer,  
  currentListing: currentListingReducer, 
  user: userReducer,
  errors: errorsReducer,
});

export default rootReducer;
