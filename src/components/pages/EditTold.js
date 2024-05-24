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
import { useNavigate, useParams } from "react-router-dom";

const EditTold = () => {
  const navigate = useNavigate();
  const { postId } = useParams(); // Get postId from URL parameters


  const [titleName, settitleName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(""); // State to store current date and time
  const [post, setPost] = useState(null); // Add state for the post

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Prepare the GraphQL query
        const query = `
        query GetPostFromId($postId: ID!) {
          getPostFromId(postId: $postId) {
            _id
            title
            description
            categories
            
          }
        }
      `;

        // Prepare the variables for the query
        const variables = {
          postId: postId,
        };

        // Make a POST request to the GraphQL endpoint using Axios
        const response = await axios.post("http://localhost:5000/graphql", {
          query: query,
          variables: variables,
        });

        // Update the state with the fetched post
        setPost(response.data.data.getPostFromId);

        // Set default values for title and description
        settitleName(response.data.data.getPostFromId.title);
        setDescription(response.data.data.getPostFromId.description);
        setCategoryName(response.data.data.getPostFromId.categories);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

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
      // Prepare the GraphQL mutation
      const mutation = `
        mutation UpdatePost($postId: ID!, $title: String!, $description: String!, $categories: [String!]!, $editedAt: String!) {
          updatePost(postId: $postId, title: $title, description: $description, categories: $categories, editedAt: $editedAt ) {
            _id
            title
          }
        }
      `;

      // Prepare the variables for the mutation
      const variables = {
        postId: postId,
        title: titleName,
        description: description,
        categories: categoryName,
        editedAt: String(currentDateTime),
      };
      // Make a POST request to the GraphQL endpoint using Axios
      const response = await axios.post("http://localhost:5000/graphql", {
        query: mutation,
        variables: variables,
      });

      // Handle the response
      console.log("Post updated successfully:", response.data.data.updatePost);

      // Redirect or perform any other actions after successful update
      navigate("/"); // Example: Redirect to home page
    } catch (error) {
      console.error("Error updating post:", error);
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
          Edit Told
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
          Save Changes
        </Button>
      </Container>
    </Box>
  );
};

export default EditTold;
