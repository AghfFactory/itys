import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import StickyFooter from "../footer/StickyFooter";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom"; // Navigation for redirection after submit
import Link from "@mui/material/Link";
import ChangePasswordDialog from "../dialogue/ChangePasswordDialog";
const UserSetting = ({ userId }) => {
  const { control, handleSubmit, reset } = useForm();
  const [user, setUser] = useState(null); // Use null to check for loaded data
  const [passDialogOpen, setPasswordDialogOpen] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function
  const openPasswordDialog = (e) => {
    setPasswordDialogOpen(true);
  };

  const closePasswordDialog = (e) => {
    setPasswordDialogOpen(false);
  };
  useEffect(() => {
    const getUserFromToken = async () => {
      const authToken = Cookies.get("authToken");
      if (authToken) {
        try {
          const query = `
            query GetUserFromToken($token: String!) {
              getUserFromToken(token: $token) {
                _id
                firstName
                lastName
                email
              }
            }
          `;
          const variables = { token: authToken };
          const response = await axios.post("http://localhost:5000/graphql", {
            query,
            variables,
          });
          setUser(response.data.data.getUserFromToken);
          reset(response.data.data.getUserFromToken); // Reset form with fetched data
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getUserFromToken();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const mutation = `
        mutation UpdateUser($userId: ID!, $firstName: String!, $lastName: String!, $email: String!) {
          updateUser(userId: $userId, firstName: $firstName, lastName: $lastName, email: $email) {
            _id
          }
        }
      `;

      const variables = {
        userId: user._id, // Corrected variable name
        firstName: data.firstName, // Use data from the form
        lastName: data.lastName,
        email: data.email,
      };

      const response = await axios.post("http://localhost:5000/graphql", {
        query: mutation,
        variables,
      });

      console.log("User updated successfully:", response.data.data.updateUser);

      // Redirect after successful update
      navigate("/"); // Redirect to homepage or a success page
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Only render the form if user data is available
  if (!user) {
    return <Typography>Loading...</Typography>;
  }

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
        <Typography variant="h5" mb={2}>
          User Settings
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="firstName"
                control={control}
                defaultValue={user.firstName}
                render={({ field }) => (
                  <TextField label="First Name" fullWidth {...field} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue={user.email}
                render={({ field }) => (
                  <TextField label="Email" type="email" fullWidth {...field} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="lastName"
                control={control}
                defaultValue={user.lastName}
                render={({ field }) => (
                  <TextField label="Last Name" fullWidth {...field} />
                )}
              />
            </Grid>

            <Button
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Save Changes
            </Button>
            <Grid item>
              <Link href="#" onClick={openPasswordDialog} variant="body2">
                Do you want to Change Your password?
              </Link>
              <ChangePasswordDialog
                open={passDialogOpen}
                onClose={closePasswordDialog}
                userId={user._id}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      <StickyFooter />
    </Box>
  );
};

export default UserSetting;
