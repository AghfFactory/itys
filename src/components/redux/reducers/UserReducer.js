// src/redux/reducers/userReducer.js
const initialState = {
  isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        
        isAuthenticated: true,
      };

    case 'LOGOUT':
      return {
        ...state,
       
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default userReducer;
