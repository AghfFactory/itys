import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios library
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AddTold = () => {
  const navigate = useNavigate();
  const [titleName, settitleName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(""); // State to store current date and time
  useEffect(() => {
    // Function to get and update current date and time
    const updateCurrentDateTime = () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString(); // Format date as string
      const formattedTime = currentDate.toLocaleTimeString(); // Format time as string
      setCurrentDateTime(`${formattedDate} ${formattedTime}`); // Combine date and time
    };

    // Call the function to update current date and time initially
    updateCurrentDateTime();

    // Set up a timer to update current date and time every second
    const intervalId = setInterval(updateCurrentDateTime, 1000);

    // Clear the interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []); // Run only once after component mounts

  const handletitleNameChange = (event) => {
    settitleName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Get the token from cookies
      const token = Cookies.get("authToken");

      // Prepare the GraphQL query to get the userId from the token
      const query = `
        query GetUserIdFromToken($token: String!) {
          getUserIdFromToken(token: $token)
        }
      `;

      // Prepare the variables for the query
      const variables = {
        token: token,
      };

      // Make a POST request to the GraphQL endpoint using Axios
      const response = await axios.post("http://localhost:5000/graphql", {
        query: query,
        variables: variables,
      });

      // Extract the userId from the response
      const userId = response.data.data.getUserIdFromToken;

      // Prepare the GraphQL mutation to create a post
      const mutation = `
        mutation CreatePost($title: String!, $description: String!, $categories: [String!]!, $userId: ID!, $createdAt: String!) {
          createPost(title: $title, description: $description, categories: $categories, userId: $userId, createdAt: $createdAt ) {
            _id
            title
            description
            categories
            userId
            createdAt
          }
        }
      `;

      // Prepare the variables for the mutation
      const postVariables = {
        title: titleName,
        description: description,
        categories: categoryName,
        userId: userId,
        createdAt: String(currentDateTime),
      };

      // Make a POST request to the GraphQL endpoint using Axios
      const postResponse = await axios.post("http://localhost:5000/graphql", {
        query: mutation,
        variables: postVariables,
      });

      console.log(
        "Post created successfully:",
        postResponse.data.data.createPost
      );

      // Clear the form fields after successful submission
      settitleName("");
      setDescription("");
      setCategoryName([]);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const categoriesList = [
    "Business",
    "Relationship",
    "Education",
    "Personal",
    "Other",
  ];

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
        <Typography
          variant="h2"
          component="header"
          gutterBottom
          sx={{ textAlign: "center", whiteSpace: "nowrap" }}
        >
          Create a New Told
        </Typography>
        <TextField
          label="Title"
          value={titleName}
          onChange={handletitleNameChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="I told you ...."
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Category</InputLabel>
          <Select
            label="Category"
            multiple
            autoWidth
            value={categoryName}
            onChange={handleCategoryChange}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((category) => (
                  <Chip key={category} label={category} />
                ))}
              </Box>
            )}
          >
            {categoriesList.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={categoryName.indexOf(category) > -1} />
                <ListItemText primary={category} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body1" gutterBottom>
          Current Date and Time: {currentDateTime}
        </Typography>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ marginTop: "20px" }}
        >
          Create a Told
        </Button>
      </Container>
    </Box>
  );
};

export default AddTold;
