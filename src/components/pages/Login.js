import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import StickyFooter from "../footer/StickyFooter";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(null); // State for storing error messages

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT; // Use environment variable
  const isEmailValid = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); 
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
      // Validate inputs
      if (!email || !isEmailValid(email)) {
        setError("Please enter a valid email address.");
        return; // Stop form submission
      }
  
      if (!password) {
        setError("Password is required.");
        return; // Stop form submission
      }
    // Define your GraphQL mutation for login
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          
        }
      }
    `;

   

    // Prepare the variables for the mutation
    const variables = {
      email: data.get("email"),
      password: data.get("password"),
    };

    // Define the request data
    const requestData = {
      query: mutation,
      variables: variables,
    };

    try {
      // Send the GraphQL request using Axios
      const response = await axios.post(graphqlEndpoint, requestData);

      const token = response.data.data.login.token;
      Cookies.set("authToken", token);
      dispatch(setUser({ isAuthenticated: true }));
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.errors[0]?.message || "An unexpected error occurred.";
      setError(errorMessage); // Set error message in case of failure

    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container
        maxWidth="xs"
        component="main"
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Typography color="error" variant="body2">
            {error} {/* Display the error message */}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
        <StickyFooter />
    </Box>
  );
};
export default connect()(Login);
