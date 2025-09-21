"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Check if user is on signup or login page
  const isSignup = pathname === "/signup";
  const isLogin = pathname === "/login";

  return (
    <AppBar position="static"  sx={{ backgroundColor: "#ffffff" ,color: "#000000" }} elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        {/* Left Logo */}
        <Typography variant="h6" fontWeight="bold">
          InvoiceApp
        </Typography>

        {/* Right Side - Conditional */}
        {/* <Box>
          {isSignup && (
            <Button component={Link} href="/login" variant="text">
              Login
            </Button>
          )}
          {isLogin && (
            <Button component={Link} href="/signup" variant="text">
              Sign Up
            </Button>
          )}
        </Box> */}
      </Toolbar>
    </AppBar>
  );
}
