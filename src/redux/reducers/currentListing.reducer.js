const currentListingReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_SINGLE_LISTING':
        return action.payload; 
      default:
        return state;
    }
  };
  
  export default currentListingReducer;
  