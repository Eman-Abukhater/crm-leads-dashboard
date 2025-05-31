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
  profilePhoto: z.string().optional(),
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
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(lead?.profilePhoto || "");

  useEffect(() => {
    reset({
      name: lead?.name || "",
      email: lead?.email || "",
      company: lead?.company || "",
      source: lead?.source || "",
      assignedTo: lead?.assignedTo || "",
      status: lead?.status || "",
      priority: lead?.priority || "",
      profilePhoto: lead?.profilePhoto || "",
    });
    setUploadedUrl(lead?.profilePhoto || "");
  }, [lead, reset]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");

    try {
      setUploading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbjueuler/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Image upload failed");
      setUploading(false);
      return null;
    }
  };

  const handleFormSubmit = async (data) => {
    let photoUrl = uploadedUrl;

    if (selectedFile) {
      const url = await uploadToCloudinary(selectedFile);
      if (!url) return;
      photoUrl = url;
    }

    onSubmit({ ...data, profilePhoto: photoUrl });
    reset();
    setSelectedFile(null);
    setUploadedUrl(photoUrl);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{lead ? "Edit Lead" : "Add Lead"}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Existing Fields */}
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

            {/* Profile Photo Upload */}
            <Grid item xs={12} sm={6}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {uploading && <p>Uploading...</p>}
              {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
              {uploadedUrl && (
                <img
                  src={uploadedUrl}
                  alt="Profile Preview"
                  style={{ width: 100, height: 100, borderRadius: "50%", marginTop: 10 }}
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
