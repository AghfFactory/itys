import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';


import ShareDialog from "../dialogue/ShareDialogue";

const ToldCard = ({ postId, title, description, createdAt, tags, onClick }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const openShareDialog = (e) => {
    e.stopPropagation(); // Prevents the card's onClick from triggering
    setShareDialogOpen(true);
  };

  const closeShareDialog = (e) => {
    e.stopPropagation(); // Prevents propagation when closing
    setShareDialogOpen(false);
  };

  const shareLink = `https://itys.vercel.app/tolddetails/${postId}`; // Change to your shareable link format

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
        p: 2, // Padding for the outer box
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width:"100%",

          borderRadius: 2, // Softer corners
          boxShadow: 3, // Subtle shadow for depth
          p: 2, // Padding for the card
          transition: "transform 0.3s ease", // Smooth hover effect
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom on hover
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width:"100%",

            justifyContent: "center",
            p: 2, // Padding for card content
          }}
        >
          <ButtonBase
            onClick={onClick}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "#f0f0f0", // Subtle hover effect
              },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%", mb: 1 }} // Ensure full-width stack
            >
              <Typography variant="h5" component="div" sx={{ textAlign: "left" }} >
                {title}
              </Typography>
              <Typography variant="caption"sx={{ textAlign: "right" }} >
                Created At : {createdAt}
              </Typography>
            </Stack>
            <Divider variant="middle"  sx={{width:"100%", mt:2}}/>

            <Box
              sx={{
                padding: "16px", // Padding inside the box for spacing
                margin: "16px 0", // Top and bottom margin to separate from other elements
                borderRadius: "4px", // Slightly rounded corners
              }}
            >
              <Typography
                variant="body1" // Standard body text
                paragraph
                gutterBottom // Adds spacing at the bottom
                
              >
                {description}
              </Typography>
              
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {tags.map((tag, index) => (
                <Chip key={index} label={tag} color="primary" />
              ))}
            </Stack>
          </ButtonBase>

          <Divider variant="middle"  sx={{width:"100%", mt:2}}/>

        </CardContent>

        <IconButton onClick={openShareDialog} sx={{ alignSelf: "flex-end" }}>
            <ShareIcon />
          </IconButton>
          <ShareDialog
            open={shareDialogOpen}
            onClose={closeShareDialog}
            shareLink={shareLink}
            title={title}
            description={description}
            tags={tags}
            createdAt={createdAt}
          />
      </Card>
    </Box>
  );
};

export default ToldCard;
