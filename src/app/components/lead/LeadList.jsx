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

export default function LeadList({ leadsfilter }) {
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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Leads
      </Typography>

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
                <TableCell>Company</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
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
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    {/*Add Details Button */}
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => router.push(`/leads/${lead.id}`)}
                    >
                      <Info /> 
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
