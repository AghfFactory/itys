import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Timeline from "../timeline/Timeline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Cookies from "js-cookie";

const ToldDetails = () => {
  const { postId } = useParams(); // Get postId from URL parameters
  const navigate = useNavigate();

  const [selectedEdit, setSelectedEdit] = useState(null);
  const [lastEdit, setLastEdit] = useState(true);
  const apiUrl = process.env.REACT_APP_GRAPHQL_ENDPOINT;

  const [post, setPost] = useState(null); // State for the fetched post
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = Cookies.get("authToken"); // Retrieve token from cookies
        if (!token) {
          throw new Error("No token found");
        }

        const query = `
        query GetUserIdFromToken($token: String!) {
          getUserIdFromToken(token: $token)
        }
      `;

        const response = await axios.post(apiUrl, {
          query,
          variables: { token },
        });

        const userId = response.data.data.getUserIdFromToken;
        setUserId(userId); // Set the user ID
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setUserId(null); // Reset if error occurs
      }
    };

    fetchUserId(); // Fetch user ID when component mounts
  }, []); // No dependencies, runs once on mount

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = `
          query GetPostFromId($postId: ID!) {
            getPostFromId(postId: $postId) {
              _id
              title
              description
              categories
              createdAt
              userId
              edits {
                title
                description
                categories
                editedAt
              }
            }
          }
        `;
        const response = await axios.post(apiUrl, {
          query,
          variables: { postId },
        });

        setPost(response.data.data.getPostFromId); // Set the fetched post data
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null); // Reset if error occurs
      }
    };

    fetchPost(); // Fetch the post when `postId` changes
  }, [postId]);

  const handleEditClick = () => {
    if (canEdit) {
      // Ensure canEdit is true before navigating
      navigate(`/edittold/${postId}`);
    } else {
      console.warn("Unauthorized edit attempt.");
    }
  };

  const handleEditSelect = (edit, isLastEdit) => {
    setSelectedEdit(edit);
    setLastEdit(isLastEdit);
  };
  const canEdit = userId && post && userId === post.userId; // Check if the current user is the post's owner
  console.log(canEdit);
  return (
    <Box>
      <Container
        maxWidth="md"
        component="main"
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {post ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ textAlign: "left" }}
                >
                  {selectedEdit ? selectedEdit.title : post.title}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ textAlign: "right" }}
                >
                  {"created at : " + post.createdAt}
                </Typography>
              </Grid>
              <Divider variant="middle" sx={{ width: "100%", mt: 2 }} />

              <Grid item xs={12}>
                <Box
                  sx={{
                    padding: "16px", // Padding inside the box for spacing
                    margin: "16px 0", // Top and bottom margin to separate from other elements
                    borderRadius: "4px", // Slightly rounded corners
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body1" gutterBottom paragraph>
                    {selectedEdit ? selectedEdit.description : post.description}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%", mt: 8, mb: 4 }}
                >
                  {(selectedEdit
                    ? selectedEdit.categories
                    : post.categories
                  )?.map((category) => (
                    <Chip
                      color="primary"
                      key={category}
                      label={category}
                      style={{ marginRight: 5 }}
                    />
                  ))}
                </Stack>
              </Grid>
              <Divider variant="middle" sx={{ width: "100%", mt: 2 }} />

              <Grid item xs={12} sx={{ mt: 8 }}>
                <Timeline edits={post.edits} onEditSelect={handleEditSelect} />
              </Grid>
              {canEdit ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleEditClick}
                    disabled={!lastEdit}
                    size="large"
                    sx={{
                      mt: 16,
                    }}
                  >
                    Edit
                  </Button>
                </Grid>
              ) : (
                <Typography variant="body2" >
                  This Post has been shared with you.
                </Typography>
              )}
            </Grid>
          </Box>
        ) : (
          <Typography>Loading...</Typography> // Loading while fetching data
        )}
      </Container>
    </Box>
  );
};

export default ToldDetails;
