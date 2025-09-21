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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  companyName: yup.string().required("Company Name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  zip: yup.string().required("Zip Code is required"),
  currency: yup.string().required("Currency is required"),
});

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
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
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        sx={{ backgroundColor: "#e0f7fa",  }}
      >
        {/* Header */}
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Wellcome back
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Log in to your account
        </Typography>

        {/* Card */}
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

            {/* Sign Up Button */}
            <Box textAlign="right" mt={1}>
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Box>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              <a href="/signup">Create account </a>
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
    px: 1,
    display: "flex",
    flexDirection: "column", // always column (for 2 lines on desktop)
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: 1,
  }}
>
  <Typography variant="body2" color="text.secondary">
    © 2025 InvoiceApp. All rights reserved
  </Typography>

  {/* Links */}
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" }, // mobile = column, desktop = row
      gap: { xs: 0.5, sm: 3 },
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
      Privacy Policy
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
      Terms of Service
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
      Support
    </Typography>
  </Box>
</Box>


    </>
  );
}
