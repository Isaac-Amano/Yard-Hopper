import { combineReducers } from 'redux';
import listingsReducer from './listings.reducer';
import userListingsReducer from './userListings.reducer';
import currentListingReducer from './currentListing.reducer'; // Import if created
import userReducer from './user.reducer';
import errorsReducer from './errors.reducer';

const rootReducer = combineReducers({
  listings: listingsReducer,         // Handles all listings
  userListings: userListingsReducer,  // Handles user-specific listings
  currentListing: currentListingReducer, // Handles individual listing details
  user: userReducer,
  errors: errorsReducer,
});

export default rootReducer;
