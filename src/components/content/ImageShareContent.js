import React from 'react';
import { Box, Typography, Chip, Button, Stack } from '@mui/material';
import { toPng } from 'html-to-image';

const ImageShareContent = ({ title, description, createdAt, tags = [], onScreenshot }) => {
  const contentRef = React.useRef(null);

  const handleCreateScreenshot = () => {
    if (contentRef.current) {
      toPng(contentRef.current)
        .then((dataUrl) => {
          if (onScreenshot) {
            onScreenshot(dataUrl); // Call the callback with the generated screenshot
          }
        })
        .catch((error) => {
          console.error('Error creating screenshot:', error);
        });
    }
  };

  return (
    <Box>
     
      <Box
        ref={contentRef}
        sx={{
          padding: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Created At: {createdAt}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ marginTop: '8px' }}>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Chip key={index} label={tag} />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No Tags Available
            </Typography>
          )}
        </Stack>
      </Box>
      
    </Box>
  );
};

export default ImageShareContent;
