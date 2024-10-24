const listingsReducer = (state = [], action) => {
    switch (action.type) {
     
        case 'SET_LISTINGS':
          return { ...state, allListings: action.payload };
          case 'SET_SINGLE_LISTING':
            return { ...state, currentListing: action.payload };
          default:
            return state;
        }
      };