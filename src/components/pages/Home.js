import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import StickyFooter from "../footer/StickyFooter";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import ToldCard from "../cards/ToldCard";
import Cookies from "js-cookie";
import axios from "axios";
import Stack from "@mui/material/Stack";
import { connect } from "react-redux";

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = (postId) => {
    navigate(`/tolddetails/${postId}`, { state: { postId: postId } });
  };

  useEffect(() => {
    const getPostsFromToken = async () => {
      const authToken = Cookies.get("authToken");
      if (authToken) {
        try {
          const query = `
          query GetPostsFromToken($token: String!) {
            getPostsFromToken(token: $token) {
              _id
              title
              description
              categories
              userId
              createdAt
            }
          }
        `;

          const variables = { token: authToken };

          const response = await axios.post("http://localhost:5000/graphql", {
            query: query,
            variables: variables,
          });

          setPosts(response.data.data.getPostsFromToken);
        } catch (error) {
          console.error("Error fetching posts:", error);
          setError("Failed to fetch posts");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    getPostsFromToken();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
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
        <Typography
          variant="h1"
          component="header"
          gutterBottom
          sx={{ textAlign: "center"}}
        >
          I-Told-You-So
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          based on I'm right and you're wrong but most importantly I'm right
        </Typography>
        {isAuthenticated ? (
          <>
            <Box>
              <Button
                variant="contained"
                onClick={() => navigate("/addtold")}
                size="large"
                sx={{ mt: 16 }}
              >
                Create a Told
              </Button>
            </Box>
            {loading ? (
              <Typography variant="body1" align="center" mt={4}>
                Loading...
              </Typography>
            ) : error ? (
              <Typography variant="body1" align="center" mt={4} color="error">
                {error}
              </Typography>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Box
                  width="75%"
                  key={post._id}
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack spacing={2} sx={{ width: "100%" }}>
                    <div onClick={() => handleClick(post._id)}>
                      <ToldCard
                        postId={post._id}
                        title={post.title}
                        description={post.description}
                        createdAt={post.createdAt}
                        tags={post.categories}
                      />
                    </div>
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography variant="body1" align="center" mt={4}>
                Your told appears here
              </Typography>
            )}
          </>
        ) : (
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              size="large"
              sx={{ mt: 16 }}
            >
              Login to show your tolds here!
            </Button>
          </Box>
        )}
      </Container>
      <StickyFooter />
    </Box>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.UserReducer.isAuthenticated,
});

export default connect(mapStateToProps)(Home);
