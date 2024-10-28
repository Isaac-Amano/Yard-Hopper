// listings.reducer.js

const listingsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_LISTINGS':
      return action.payload; // Directly sets all listings

    default:
      return state;
  }
};

export default listingsReducer;
