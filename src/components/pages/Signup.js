import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";
import { useNavigate } from "react-router-dom";

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

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const isValidEmail = (email) => {
    // Simple email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password) => {
    // Basic strong password criteria: at least 8 characters, one uppercase, one lowercase, one number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    return strongPasswordRegex.test(password);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    const newFormErrors = { ...formErrors };

    // Validate first name
    if (!formData.firstName) {
      newFormErrors.firstName = "First name is required.";
      isValid = false;
    } else {
      newFormErrors.firstName = "";
    }

    // Validate last name
    if (!formData.lastName) {
      newFormErrors.lastName = "Last name is required.";
      isValid = false;
    } else {
      newFormErrors.lastName = "";
    }
    if (!formData.userName) {
      newFormErrors.userName = "User name is required.";
      isValid = false;
    } else {
      newFormErrors.userName = "";
    }
    // Validate email
    if (!formData.email) {
      newFormErrors.email = "Email is required.";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newFormErrors.email = "Invalid email format.";
      isValid = false;
    } else {
      newFormErrors.email = "";
    }

    // Validate password
    if (!formData.password) {
      newFormErrors.password = "Password is required.";
      isValid = false;
    } else if (!isStrongPassword(formData.password)) {
      newFormErrors.password =
        "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.";
      isValid = false;
    } else {
      newFormErrors.password = "";
    }

    setFormErrors(newFormErrors);

    if (!isValid) {
      return; // Prevent form submission if there are validation errors
    }
    try {
      const response = await axios.post(graphqlEndpoint, {
        query: `
                mutation CreateUser($firstName: String!, $lastName: String!, $userName: String!, $email: String!, $password: String!) {
                    createUser(firstName: $firstName, lastName: $lastName, userName: $userName, email: $email, password: $password) {
                        _id
                        firstName
                        lastName
                        userName
                        email
                        password
                        
                    }
                }
            `,
        variables: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        },
      });

      const responseData = response.data.data.createUser;
      console.log("User created:", responseData);

      // Add any necessary logic after successful user creation
      //Cookies.set("authToken", token);
      // dispatch(setUser({ isAuthenticated: true }));

      navigate("/sendverification", { state: { email: responseData.email } });
    } catch (error) {
    
        const errorMessage = error.response?.data?.errors[0]?.message || "An unexpected error occurred.";
        setError(errorMessage);
      
      // Add error handling logic
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
          Sign up
        </Typography>
        {error && (
          <Typography color="error" variant="body2">
            {error} {/* Display the error message */}
          </Typography>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName} // Display error message
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName} // Display error message
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="userName"
                  autoComplete="username"
                  value={formData.userName}
                  onChange={handleInputChange}
                  error={!!formErrors.userName}
                  helperText={formErrors.userName} // Display error message
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email} // Display error message
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password} // Display error message
                />
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
        <StickyFooter />
    </Box>
  );
};

export default connect()(SignUp);
