import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { setUser } from "../redux/actions";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
const Verified = () => {
  const [status, setStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch hook

  useEffect(() => {
    const token = location.pathname.split("/").pop(); // Extract the token from the URL

    const verifyToken = async (token) => {
      if (!token) {
        // If the token is invalid or missing, set error status
        setStatus("Invalid or missing token");
        return;
      }

      try {
        // GraphQL query to verify the user
        const query = `
        mutation VerifyUser($token: String!) {
            verifyUser(token: $token) {
              success
              message
            }
          }
        `;

        const variables = { token };
        const response = await axios.post("http://localhost:5000/graphql", {
            query,
            variables,
        });

        const verifyUser = response.data.data.verifyUser;

        if (verifyUser.success) {
          Cookies.set("authToken", token);
          dispatch(setUser({ isAuthenticated: true }));
          setStatus("Verification successful.");
          setTimeout(() => {
            navigate("/"); 
          }, 3000);
        } else {
          setStatus("Verification failed: " + verifyUser.message);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setStatus("Error during verification. Please try again.");
      }
    };

    // Verify the token
    verifyToken(token);
  }, [location, navigate]);

  return (
    <div>
      {status ? (
        <p>{status}</p> // Display the verification status or error message
      ) : (
        <p>Verifying...</p> // Display a loading message while verifying
      )}
    </div>
  );
};

export default connect()(Verified);
