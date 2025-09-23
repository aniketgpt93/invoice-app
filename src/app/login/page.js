"use client";

import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  InputLabel,
  styled,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setAuthData } from "@/store/slices/authSlice";
import ErrorModal from "@/components/modal/ErrorModal";
import PublicRoute from "@/components/PublicRoute";
import Navbar from "@/components/Navbar";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Enter a valid email"),
  password: yup
    .string()
    .min(8, "Min 8 characters")
    .required("Enter your password."),
});

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/Login`,
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );

      dispatch(setAuthData(response.data));

      console.log("Login success:", response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message =
        error.response?.data || error.message || "Something went wrong, please try again.";
        console.log(message,"message")
      setError(message);
      setOpen(true);
      // console.error("Login failed:", error.response?.data || error.message);
    }
  };
  const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "40px",
      "& input": {
        padding: "8px 12px",
        "&::placeholder": {
          fontSize: "0.9 rem",
        },
      },
    },
  });
  const LabelText = styled(Typography)({
    display: "block",
    marginBottom: 0,
    fontWeight: "bold",
    fontSize: "0.85rem",
  });

  return (
    <PublicRoute>
      <ErrorModal open={open} onClose={() => setOpen(false)} message={error} />
        <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={4}
        pb={2}
        sx={{ backgroundColor: "#e0f7fa" }}
      >
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Wellcome back
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Log in to your account
        </Typography>

        <Card sx={{ maxWidth: 400, width: "100%", p: 4, borderRadius: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  {" "}
                  <LabelText variant="subtitle1" component={"span"}>
                    Email*
                  </LabelText>
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder="Enter your email"
                    margin="none"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Box>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Password*
                  </LabelText>
                  <CustomTextField
                    {...field}
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="none"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    placeholder="Enter password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
            />

            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Remember me"
                  sx={{ mb: 1 }}
                />
              )}
            />

            <Box textAlign="right" mt={1}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </Box>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              <a href="/">Create account </a>
            </Typography>
          </Box>
        </Card>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          color: "#000000",
          py: { xs: 1, sm: 2 },
          // px: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 InvoiceApp. All rights reserved
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // mobile = column, desktop = row
            gap: { xs: 0.5, sm: 3 },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: "pointer" }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: "pointer" }}
          >
            Terms of Service
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: "pointer" }}
          >
            Support
          </Typography>
        </Box>
      </Box>
    </PublicRoute>
  );
}
