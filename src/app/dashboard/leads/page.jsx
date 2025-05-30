"use client";

import LeadList from "@/app/components/lead/LeadList";
import { useLeads } from "@/features/leads/hooks";
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
  Button,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { signOut } from "next-auth/react";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function LeadDashboardPage() {
  const { data: session, status } = useSession();
  const { data: leads = [], isLoading, isError } = useLeads();
  const userRole = session?.user?.role;
  const userEmail = session?.user?.email;
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const filteredLeads = useMemo(() => {
    let visibleLeads = leads;

    // If user is a sales-rep, only show leads assigned to them
    if (userRole === "sales-rep") {
      visibleLeads = leads.filter((lead) => lead.assignedTo === userEmail);
    }

    return visibleLeads.filter((lead) => {
      return (
        (statusFilter === "" || lead.status === statusFilter) &&
        (priorityFilter === "" || lead.priority === priorityFilter) &&
        (sourceFilter === "" || lead.source === sourceFilter)
      );
    });
  }, [leads, statusFilter, priorityFilter, sourceFilter, userRole, userEmail]);

  const leadStats = useMemo(() => {
    const stats = { total: leads.length, converted: 0, lost: 0, inProgress: 0 };
    leads.forEach((lead) => {
      if (lead.status === "Converted") stats.converted++;
      else if (lead.status === "Lost") stats.lost++;
      else if (lead.status === "In Progress") stats.inProgress++;
    });
    return stats;
  }, [leads]);
  const router = useRouter();

  if (status === "loading") return <CircularProgress />;
  if (!session) {
    router.push("/login");
    return null;
  }

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading leads</Typography>;

  // Chart data for lead status distribution
  const chartData = {
    labels: ["Converted", "In Progress", "Lost"],
    datasets: [
      {
        label: "Leads Status",
        data: [leadStats.converted, leadStats.inProgress, leadStats.lost],
        backgroundColor: ["#4caf50", "#2196f3", "#f44336"], // green, blue, red
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Leads Status Overview",
      },
    },
  };

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">Lead Dashboard</Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </Button>
      </Box>

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

      {/* Chart Section */}
      <Box sx={{ my: 4, maxWidth: 500 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Bar data={chartData} options={chartOptions} />
        </Paper>
      </Box>

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
            <MenuItem value="Email Campaign">Email Campaign</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lead Table */}
      <LeadList leadsfilter={filteredLeads} />
    </Box>
  );
}
