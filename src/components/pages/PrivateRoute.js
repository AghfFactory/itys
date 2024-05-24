import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({children}) => {
  const isAuthenticated = useSelector(state => state.UserReducer.isAuthenticated); // Get authentication state from Redux store

  let location = useLocation();

  if(!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location}} replace />
  }
  return children

};

export default PrivateRoute;