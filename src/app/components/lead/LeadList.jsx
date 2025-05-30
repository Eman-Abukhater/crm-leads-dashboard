"use client";

import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Paper,
  TablePagination,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Edit, Info } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignLeads,
  updateLeadsStatus,
  deleteLeads,
} from "@/features/leads/services";
import { useRouter } from "next/navigation";
import LeadFormModal from "./LeadFormModal"; // Importing the modal component for adding/editing leads
import { toast } from "react-toastify";

export default function LeadList({ leadsfilter }) {
  const router = useRouter();
  // State management for modal visibility and lead editing
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, lead: null });

  // Importing the necessary services for lead operations

  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: assignLeads,
    onSuccess: () => queryClient.invalidateQueries(["leads"]),
  });

  const statusMutation = useMutation({
    mutationFn: updateLeadsStatus,
    onSuccess: () => queryClient.invalidateQueries(["leads"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeads,
    onSuccess: () => queryClient.invalidateQueries(["leads"]),
  });

  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize leads with the  filtered data
  useEffect(() => {
    setLeads(leadsfilter);
  }, [leadsfilter]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allIds = leads.map((lead) => lead.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleBulkAssign = (assignee) => {
    assignMutation.mutate({ ids: selected, assignee });
    setSelected([]);
  };
  const handleBulkUpdateStatus = (status) => {
    statusMutation.mutate({ ids: selected, status });
    setSelected([]);
  };

  const handleBulkDelete = () => {
    deleteMutation.mutate({ ids: selected });
    setSelected([]);
  };

  const paginatedLeads = leads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // Modal for adding/editing leads
  const dropdownOptions = {
    sources: ["Website", "LinkedIn", "Referral","Email Campaign", "Social Media" , "Event","Cold Call", "Other"],
    staff: ["rep@crm.com", "manager@crm.com"],
    statuses: ["New", "In Progress", "Converted", "Lost"],
    priorities: ["Low", "Medium", "High"],
  };

  const handleAddSubmit = (data) => {
    toast.success("The lead Added successful! 🎉");
    console.log("Add lead:", data);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    console.log("Edit lead:", data);
    toast.success("The lead Updated successful! 🎉");
    setEditModal({ open: false, lead: null });
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Leads</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddModalOpen(true)}
        >
          Add Lead
        </Button>
      </Box>

      {selected.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Typography>{selected.length} selected</Typography>

          <Select
            size="small"
            displayEmpty
            value=""
            onChange={(e) => handleBulkAssign(e.target.value)}
          >
            <MenuItem value="" disabled>
              Assign to...
            </MenuItem>
            <MenuItem value="rep@crm.com">rep@crm.com</MenuItem>
            <MenuItem value="manager@crm.com">manager@crm.com</MenuItem>
          </Select>

          <Select
            size="small"
            displayEmpty
            value=""
            onChange={(e) => handleBulkUpdateStatus(e.target.value)}
          >
            <MenuItem value="" disabled>
              Set Status...
            </MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === leads.length}
                    indeterminate={
                      selected.length > 0 && selected.length < leads.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(lead.id)}
                      onChange={() => handleSelect(lead.id)}
                    />
                  </TableCell>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.priority}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setEditModal({ open: true, lead })}
                    >
                      <Edit />
                    </IconButton>

                    {/*Add Details Button */}
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                    >
                      <Info />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for adding and editing leads */}

        <LeadFormModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          dropdownOptions={dropdownOptions}
        />

        <LeadFormModal
          open={editModal.open}
          onClose={() => setEditModal({ open: false, lead: null })}
          onSubmit={handleEditSubmit}
          lead={editModal.lead}
          dropdownOptions={dropdownOptions}
        />

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
