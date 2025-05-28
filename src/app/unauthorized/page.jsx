'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
      px={2}
      textAlign="center"
    >
      <Typography variant="h3" color="error" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="h6" mb={3}>
        You do not have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/"
      >
        Go to Home
      </Button>
    </Box>
  );
}
