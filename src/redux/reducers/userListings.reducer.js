const userListingsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_LISTINGS':
      return action.payload;  // Set the state directly as the payload instead of complex crap
    default:
      return state;
  }
};

export default userListingsReducer;
