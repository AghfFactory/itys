import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";

const formatEditedAt = (editedAt) => {
  const date = new Date(editedAt);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Timeline = ({ edits, onEditSelect }) => {
  const [activeStep, setActiveStep] = useState(edits.length - 1);

  const isLastEdit = (index) => {
    return index === edits.length - 1;
  };
  const isFirstEdit = (index) => {
    return index === 0;
  };
  const handleClick = (edit, index) => {
    // Handle click action to view the changes of the edit
    console.log("Viewing changes for edit:", edit);
    // Pass the selected edit to the parent component
    onEditSelect(edit, isLastEdit(index));
    // Update active step
    setActiveStep(index);
  };

  return (
    <Stepper nonLinear activeStep={activeStep} connector={<StepConnector />}>
      {/* Render the steps */}
      {edits.map((edit, index) => (
        <Step key={index}>
          <StepLabel>
            <Button onClick={() => handleClick(edit, index)}>
              {isFirstEdit(index) ? "Created at" : "View Changes at"}{" "}
              {formatEditedAt(edit.editedAt)}
            </Button>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default Timeline;
