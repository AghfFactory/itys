import React, { useEffect, useState } from "react";
import { Button, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";

const SendVerification = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const { state } = useLocation();
  const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT;

  const userEmail = state?.email;
  useEffect(() => {
    const sendVerificationEmail = async () => {
      try {
        console.log(userEmail);
        if (userEmail) {
          const response = await axios.post(graphqlEndpoint, {
            query: `
                    mutation SendVerification( $email: String!) {
                      sendVerification( email: $email) {
                          success
                          message
                            
                            
                        }
                    }
                `,
            variables: {
              email: userEmail,
            },
          });

          const responseData = response.data.data.sendVerification;
          console.log("User created:", responseData);
        }
      } catch (error) {
        console.error("Error sending verification email:", error);
        setStatus("An error occurred. Please try again.");
      }
    };
    sendVerificationEmail();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
       <Container
        maxWidth="md"
        component="main"
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      <Typography variant="h6">Email Verification</Typography>
      {userEmail ? (
        <Typography variant="h6">Sending Email to {userEmail}</Typography>
      ) : (
        <>
          <Typography>No email was found, Please Signup first.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/signup")}
            size="large"
            sx={{ mt: 16 }}
          >
            Signup
          </Button>
        </>
      )}
      {status && (
        <Alert severity={status.includes("successfully") ? "success" : "error"}>
          {status}
        </Alert>
      )}
      </Container>
    </Box>
  );
};

export default SendVerification;
