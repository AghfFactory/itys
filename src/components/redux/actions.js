export const setUser = (userData) => ({
    type: "SET_USER",
    payload: userData,
  });
  
  export const logoutUser = () => {
    return {
      type: "LOGOUT",
     
    };
  };