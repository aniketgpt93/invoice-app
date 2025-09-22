import { Button } from "@mui/material";

const defaultStyle = {
  mr: { xs: 0, sm: 1 },
  px: { xs: 1.5, sm: 3 },
  fontSize: { xs: "0.75rem", sm: "0.875rem" },
  color: "black",
  borderColor: "black",
  "&:hover": {
    borderColor: "black",
    backgroundColor: "rgba(0,0,0,0.04)",
  },
};

export default function CustomButton(
 { children,
  style = defaultStyle,
  // name,
  variantName = "outlined", //"outlined" | "contained" | "text",
  typeButton = "button", //"button" | "submit" | "reset"
  onClick, 
  
}) {
  return (
    <Button
      type={typeButton}
      variant={variantName}
      sx={style}
      fullWidth={{ xs: true, sm: false }}
      onClick={onClick}
    >
      {children} 
    </Button>
  );
}
