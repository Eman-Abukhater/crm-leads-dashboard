"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Company is required"),
  source: z.string().min(1, "Source is required"),
  assignedTo: z.string().min(1, "Assigned Staff is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
});

export default function LeadFormModal({
  open,
  onClose,
  onSubmit,
  lead,
  dropdownOptions = {},
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: lead || {},
  });

  useEffect(() => {
    reset(lead || {});
  }, [lead, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{lead ? "Edit Lead" : "Add Lead"}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                {...register("company")}
                error={!!errors.company}
                helperText={errors.company?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Source"
                {...register("source")}
                error={!!errors.source}
                helperText={errors.source?.message}
              >
                {(dropdownOptions.sources || []).map((src) => (
                  <MenuItem key={src} value={src}>
                    {src}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Assigned Staff"
                {...register("assignedTo")}
                error={!!errors.assignedTo}
                helperText={errors.assignedTo?.message}
              >
                {(dropdownOptions.staff || []).map((staff) => (
                  <MenuItem key={staff} value={staff}>
                    {staff}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                {(dropdownOptions.statuses || []).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                {...register("priority")}
                error={!!errors.priority}
                helperText={errors.priority?.message}
              >
                {(dropdownOptions.priorities || []).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {lead ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
