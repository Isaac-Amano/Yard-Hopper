
const userListingsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_LISTINGS':
      return action.payload; 
    default:
      return state;
  }
};

export default userListingsReducer;
