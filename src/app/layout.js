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

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
          {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
