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
import { deleteLeads, addLead, editLead, assignLeads } from "@/features/leads/services";
import { useRouter } from "next/navigation";
import LeadFormModal from "./LeadFormModal";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";  // <-- import useSession

export default function LeadList({ leadsfilter }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role; // assuming user role is stored here
  const userEmail = session?.user?.email;

  // Filter leads based on role
  let leads = leadsfilter || [];
  if (userRole === "rep") {
    leads = leads.filter((lead) => lead.assignedTo === userEmail);
  }

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteLeads,
    onSuccess: () => queryClient.invalidateQueries(["leads"]),
  });

  const addLeadMutation = useMutation({
    mutationFn: addLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("The lead was added successfully! 🎉");
    },
  });
  const assignMutation = useMutation({
    mutationFn: assignLeads,
    onSuccess: () => queryClient.invalidateQueries(["leads"]),
  });
  const editLeadMutation = useMutation({
    mutationFn: editLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("The lead was updated successfully! 🎉");
    },
  });

  const [localLeads, setLocalLeads] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setLocalLeads(leads);
    setSelected([]);
    setPage(0);
  }, [leadsfilter, userRole, userEmail]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allIds = localLeads.map((lead) => lead.id);
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

  const handleBulkDelete = () => {
    deleteMutation.mutate({ ids: selected });
    setSelected([]);
  };

  const handleBulkAssign = (assignee) => {
    assignMutation.mutate({ ids: selected, assignee });
    setSelected([]);
  };

  const paginatedLeads = localLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const dropdownOptions = {
    sources: [
      "Website",
      "LinkedIn",
      "Referral",
      "Email Campaign",
      "Social Media",
      "Event",
      "Cold Call",
      "Other",
    ],
    staff: ["rep@crm.com", "manager@crm.com"],
    statuses: ["New", "In Progress", "Converted", "Lost"],
    priorities: ["Low", "Medium", "High"],
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, lead: null });

  const handleAddSubmit = (data) => {
    addLeadMutation.mutate(data);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    editLeadMutation.mutate(data);
    setEditModal({ open: false, lead: null });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Leads</Typography>

        {/* Add Lead button only for admin and manager */}
        {(userRole === "admin" || userRole === "manager") && (
          <Button variant="contained" color="primary" onClick={() => setAddModalOpen(true)}>
            Add Lead
          </Button>
        )}
      </Box>

      {/* Bulk actions only for admin and manager */}
      {(userRole === "admin" || userRole === "manager") && selected.length > 0 && (
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
          <Button size="small" color="error" variant="outlined" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </Box>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {(userRole === "admin" || userRole === "manager") && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length === localLeads.length && localLeads.length > 0}
                      indeterminate={selected.length > 0 && selected.length < localLeads.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                )}
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
                  {(userRole === "admin" || userRole === "manager") && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(lead.id)}
                        onChange={() => handleSelect(lead.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.priority}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    {/* Edit button only for admin and manager */}
                    {(userRole === "admin" || userRole === "manager") && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setEditModal({ open: true, lead })}
                      >
                        <Edit />
                      </IconButton>
                    )}

                    {/* Details button visible for all roles */}
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
          count={localLeads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
