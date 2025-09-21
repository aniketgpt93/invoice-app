"use client";

import Navbar from "@/components/Navbar";
import { store } from "@/store/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";


const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // blue
    },
  },
});

export default function RootLayout({ children }) {
    const pathname = usePathname();
  
    // Check if user is on signup or login page
    const isSignup = pathname === "/signup";
    const isLogin = pathname === "/login";
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
          {(isLogin ||isSignup) && <Navbar />}
          {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
