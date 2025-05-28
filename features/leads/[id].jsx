'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useLeads } from './hooks';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export default function LeadDetailsPage() {
  const { id } = useParams(); // Get the lead ID from the URL parameters
  const router = useRouter();
  const { data: leads, isLoading } = useLeads();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const lead = leads.find((l) => l.id.toString() === id);

  if (!lead) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          Lead not found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Lead Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Name: {lead.name}</Typography>
          <Typography variant="h6">Company: {lead.company}</Typography>
          <Typography variant="h6">Status: {lead.status}</Typography>
          <Typography variant="h6">Source: {lead.source}</Typography>
          <Typography variant="h6">Assigned To: {lead.assignedTo}</Typography>
          <Typography variant="h6">Priority: {lead.priority}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
