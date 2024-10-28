// userListings.reducer.js
const userListingsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_LISTINGS':
      return action.payload; // Store user-specific listings directly
    default:
      return state;
  }
};

export default userListingsReducer;
