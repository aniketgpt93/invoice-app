import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header({
  loading = false,
  onClickFunc,
  heading = "New",
}) {
  const router = useRouter();
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: "#fff",
        p: 2,
        boxShadow: 1,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="h6">{heading ? heading : "New"} Invoice</Typography>
      <Box>
        <Button
          variant="outlined"
          sx={{
            mr: { xs: 0, sm: 1 },
            px: { xs: 1.5, sm: 3 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: "black",
            borderColor: "black",
            "&:hover": {
              borderColor: "black",
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
          disabled={loading}
          onClick={() => router.push("/invoices")}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onClickFunc}
          disabled={loading}
          sx={{
            backgroundColor: "black",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saveing..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
