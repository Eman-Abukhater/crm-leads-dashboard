'use client';

import LeadList from '@/app/components/lead/LeadList';
import { useLeads } from '@/features/leads/hooks';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState, useMemo } from 'react';

export default function LeadDashboardPage() {
  const { data: leads = [], isLoading, isError } = useLeads();

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      return (
        (statusFilter === '' || lead.status === statusFilter) &&
        (priorityFilter === '' || lead.priority === priorityFilter) &&
        (sourceFilter === '' || lead.source === sourceFilter)
      );
    });
  }, [leads, statusFilter, priorityFilter, sourceFilter]);

  const leadStats = useMemo(() => {
    const stats = { total: leads.length, converted: 0, lost: 0, inProgress: 0 };
    leads.forEach((lead) => {
      if (lead.status === 'Converted') stats.converted++;
      else if (lead.status === 'Lost') stats.lost++;
      else if (lead.status === 'In Progress') stats.inProgress++;
    });
    return stats;
  }, [leads]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Error loading leads</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Lead Dashboard
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Total Leads</Typography>
            <Typography>{leadStats.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Converted</Typography>
            <Typography>{leadStats.converted}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">In Progress</Typography>
            <Typography>{leadStats.inProgress}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Lost</Typography>
            <Typography>{leadStats.lost}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box display="flex" gap={2} sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            label="Priority"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Source</InputLabel>
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            label="Source"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Referral">Referral</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lead Table */}     
      <LeadList leads={filteredLeads} />
    </Box>
  );
}
