"use client";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LeadDetailsPage() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const handleChange = (_, newValue) => setTab(newValue);

  const tabLabels = [
    "Activity Timeline",
    "Notes",
    "Attachments",
    "Contact Info",
    "Interaction Log",
  ];

  return (
    <Box sx={{ p: 4, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Lead Details
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Viewing details for Lead ID: <strong>{id}</strong>
      </Typography>

      <Paper
        elevation={3}
        sx={{ mt: 4, borderRadius: 3, overflow: "hidden", backgroundColor: "#f9f9f9" }}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            backgroundColor: "white",
            px: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{ textTransform: "none", fontWeight: 500, fontSize: "16px" }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3, minHeight: "300px" }}>
          {tab === 0 && (
            <Typography variant="body1">Activity timeline content goes here...</Typography>
          )}
          {tab === 1 && (
            <Typography variant="body1">Notes and comments for the lead...</Typography>
          )}
          {tab === 2 && (
            <Typography variant="body1">Upload and view lead-related attachments...</Typography>
          )}
          {tab === 3 && (
            <Typography variant="body1">Display contact information...</Typography>
          )}
          {tab === 4 && (
            <Typography variant="body1">List of calls, meetings, and follow-ups...</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
