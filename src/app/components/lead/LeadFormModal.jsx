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
import { useEffect, useState } from "react";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Company is required"),
  source: z.string().min(1, "Source is required"),
  assignedTo: z.string().min(1, "Assigned Staff is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  imageUrl: z.string().optional(), // 🟡 Optional image field
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    reset({
      name: lead?.name || "",
      email: lead?.email || "",
      company: lead?.company || "",
      source: lead?.source || "",
      assignedTo: lead?.assignedTo || "",
      status: lead?.status || "",
      priority: lead?.priority || "",
      imageUrl: lead?.imageUrl || "",
    });
    setPreviewUrl(lead?.imageUrl || "");
  }, [lead, reset]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // 🟡 Use your unsigned preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbjueuler/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setValue("imageUrl", data.secure_url); // 🟡 Save URL in form
      setPreviewUrl(data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (data) => {
    if (lead?.id) {
      onSubmit({ id: lead.id, ...data });
    } else {
      onSubmit(data);
    }
    reset();
    setPreviewUrl("");
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
                defaultValue={lead?.source || ""}
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
                defaultValue={lead?.assignedTo || ""}
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
                defaultValue={lead?.status || ""}
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
                defaultValue={lead?.priority || ""}
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
            {/* 🟡 Image Upload */}
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p>Uploading...</p>}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              )}
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
