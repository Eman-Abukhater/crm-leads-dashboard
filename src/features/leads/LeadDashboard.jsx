"use client";
import React from "react";
import { useLeads } from "./hooks";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import Link from "next/link";

export default function LeadDashboard() {
  const { data: leads, isLoading } = useLeads();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  // Count leads by status
  const inProgressCount = leads.filter(
    (lead) => lead.status === "In Progress"
  ).length;
  const convertedCount = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;
  const totalLeads = leads.length;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        CRM Leads Dashboard
      </Typography>

      {/* Stats cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="h6">Total Leads</Typography>
              <Typography variant="h5">{totalLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#fff3e0" }}>
            <CardContent>
              <Typography variant="h6">In Progress</Typography>
              <Typography variant="h5">{inProgressCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e8f5e9" }}>
            <CardContent>
              <Typography variant="h6">Converted</Typography>
              <Typography variant="h5">{convertedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leads table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lead List
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Priority</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link href={`/features/leads/${lead.id}`}>{lead.name}</Link>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>{lead.priority}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
