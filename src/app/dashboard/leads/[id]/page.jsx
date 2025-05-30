"use client";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LeadDetailsPage() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Lead Details - ID: {id}
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Tabs value={tab} onChange={handleChange} centered>
          <Tab label="Activity Timeline" />
          <Tab label="Notes" />
          <Tab label="Attachments" />
          <Tab label="Contact Info" />
          <Tab label="Interaction Log" />
        </Tabs>

        <Box p={2}>
          {tab === 0 && <div>Activity timeline content here</div>}
          {tab === 1 && <div>Notes section</div>}
          {tab === 2 && <div>Attachments area</div>}
          {tab === 3 && <div>Contact info display</div>}
          {tab === 4 && <div>Calls, meetings, follow-ups here</div>}
        </Box>
      </Paper>
    </Box>
  );
}
