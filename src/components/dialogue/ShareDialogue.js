import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ContentCopy as CopyIcon } from "@mui/icons-material";
import {
  Twitter,
  Facebook,
  Instagram,
  WhatsApp,
  Telegram,
} from "@mui/icons-material";
import ImageShareContent from "../content/ImageShareContent";
const ShareDialogue = ({
  open,
  onClose,
  shareLink,
  title,
  description,
  createdAt,
  tags,
}) => {
  // Data to send to ImageShareContent

  const [screenshot, setScreenshot] = useState(null);

  const handleCopyLink = (e) => {
    e.stopPropagation(); // Prevent event propagation to the parent
    navigator.clipboard.writeText(shareLink);
    onClose(e); // Close the dialog after copying
  };
  const handleScreenshot = (screenshotDataUrl) => {
    setScreenshot(screenshotDataUrl); // Store the screenshot
  };

  const handleSocialClick = (e, link) => {
    e.stopPropagation(); // Prevent propagation to the parent
   
    window.open(link, "_blank"); // Open the link in a new tab
    onClose(e); // Close the dialog without triggering the parent onClick
  };

  const downloadScreenshot = (screenshotDataUrl) => {
    if (screenshotDataUrl && screenshotDataUrl !== "PLACEHOLDER") {
      const downloadLink = document.createElement("a");
      downloadLink.href = screenshotDataUrl; // Data URL for the screenshot
      downloadLink.download = "screenshot.png"; // Name for the downloaded file
      downloadLink.click(); // Trigger the download
    }
  };
  return (
    <Dialog
      open={open}
      onClose={(e) => {
        e.stopPropagation(); // Prevent propagation when closing the dialog
        onClose(e);
      }}
    >
      <DialogTitle>Share this content</DialogTitle>
     
        <ImageShareContent
          {...{ title, description, createdAt, tags }}
          onScreenshot={handleScreenshot}
        />
      
      <DialogActions>
        <Tooltip title="Share on Twitter">
          <IconButton
            onClick={(e) =>
              handleSocialClick(
                e,
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareLink
                )}`
              )
            }
          >
            <Twitter />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on Facebook">
          <IconButton
            onClick={(e) =>
              handleSocialClick(
                e,
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareLink
                )}`
              )
            }
          >
            <Facebook />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on Instagram">
          <IconButton
            onClick={(e) =>
              handleSocialClick(
                e,
                `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  shareLink
                )}`
              )
            }
          >
            <Instagram />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share on WhatsApp">
          <IconButton
            onClick={(e) =>
              handleSocialClick(
                e,
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  shareLink
                )}`
              )
            }
          >
            <WhatsApp />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on Telegram">
          <IconButton
            onClick={(e) =>
              handleSocialClick(
                e,
                `https://t.me/share/url?url=${encodeURIComponent(shareLink)}`
              )
            }
          >
            <Telegram />
          </IconButton>
        </Tooltip>

        <Tooltip title="Copy Link">
          <IconButton onClick={handleCopyLink}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialogue;
