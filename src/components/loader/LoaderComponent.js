import { CircularProgress, Box } from "@mui/material";


export default function LoaderComponent (){
    return(
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "rgba(255,255,255,0.7)",
      zIndex: 1300, // same as MUI modal
    }}
  >
    <CircularProgress />
  </Box>
)
}

