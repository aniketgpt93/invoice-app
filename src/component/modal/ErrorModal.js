"use client";

import { Modal, Box, Typography, Button } from "@mui/material";

export default function ErrorModal({ open, onClose, message }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          minWidth: 300,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" mb={2}>
          {message}
        </Typography>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
