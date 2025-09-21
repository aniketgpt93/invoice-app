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
} from "@mui/material";
import Image from "next/image";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

 export const CustomTextField = styled(TextField)({
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
 export const LabelText = styled(Typography)({
    display: "block",
    marginBottom: 0,
    fontWeight: "bold",
    fontSize: "0.85rem",
  });
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      address: "",
      city: "",
      zip: "",
      industry: "",
      currency: "",
    },
  });
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const sizeMB = selected.size / (1024 * 1024);
      if (sizeMB < 2 || sizeMB > 5) {
        setError("File size must be between 2MB and 5MB");
        setFile(null);
      } else {
        setError("");
        setFile(selected);
      }
    }
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };


  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        sx={{ backgroundColor: "#e0f7fa" }}
      >
        {/* Header */}
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Create Your Account
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Set up your company and start invoicing in minutes.
        </Typography>

        {/* Card */}
        <Card sx={{ maxWidth: 800, width: "100%", p: 4, borderRadius: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              spacing={3}
              sx={{
                borderBottom: "1px solid black",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                p: 2,
                mb: 2,
              }}
            >
              {/* Left: User Info */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    borderBottom: "2px solid black",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold" mb={2}>
                    User Information
                  </Typography>
                </Box>

                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText variant="subtitle1" component={"span"}>
                        First Name*
                      </LabelText>
                      <CustomTextField
                        {...field}
                        fullWidth
                        margin="none"
                        placeholder="Enter first name."
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    </Box>
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText variant="subtitle1" component="span">
                        Last Name*
                      </LabelText>
                      <CustomTextField
                        {...field}
                        placeholder="Enter last name"
                        fullWidth
                        margin="none"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    </Box>
                  )}
                />

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
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>

              {/* Right: Company Info */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    borderBottom: "2px solid black",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold" mb={2}>
                    Company Information
                  </Typography>
                </Box>

                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText variant="subtitle1" component={"span"}>
                        Company Name*
                      </LabelText>
                      <CustomTextField
                        {...field}
                        placeholder="Enter company name"
                        fullWidth
                        margin="none"
                        error={!!errors.companyName}
                        helperText={errors.companyName?.message}
                      />
                    </Box>
                  )}
                />

                {/* Company Logo Upload */}
                {/* <Button variant="outlined" component="label" sx={{ my: 2 }}>
                Upload Company Logo
                <input hidden accept="image/*" type="file" />
              </Button> */}
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Upload Company Logo
                  </LabelText>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                    <Image
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : "/images/default-img.png"
                      }
                      alt="Logo Preview"
                      width={36}
                      height={36}
                      style={{
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        marginRight: 8,
                      }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        minWidth: "8px", 
                        height: "100%",
                        px: 0, 
                      }}
                    >
                      Upload
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </Button>

                    {/* File Name / Default Text in Border */}
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        px: 1,
                        py: 0.5,
                        minWidth: "120px",
                        minHeight: "36px",
                        textAlign: "center",
                        ml: 0, // margin left remove
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {file ? file.name : "No file chosen"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText variant="subtitle1" component={"span"}>
                        Address*
                      </LabelText>
                      <TextField
                        {...field}
                        fullWidth
                        margin="none"
                        variant="outlined"
                        placeholder="Enter company address"
                        multiline
                        minRows={1.8}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                          "& .MuiInputBase-input": {
                            minHeight: "1.8rem",
                          },
                        }}
                      />
                    </Box>
                  )}
                />

                <Grid container spacing={2}>
                  <Grid item size={{ xs: 6 }}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Box sx={{ mb: 1 }}>
                          <LabelText variant="subtitle1" component={"span"}>
                            City*
                          </LabelText>
                          <CustomTextField
                            {...field}
                            placeholder="Enter city"
                            fullWidth
                            margin="none"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Controller
                      name="zip"
                      control={control}
                      render={({ field }) => (
                        <Box sx={{ mb: 1 }}>
                          <LabelText variant="subtitle1" component={"span"}>
                            Zip Code*
                          </LabelText>
                          <CustomTextField
                            {...field}
                            placeholder="6 digit zip code"
                            fullWidth
                            margin="none"
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText variant="subtitle1" component={"span"}>
                        Industry*
                      </LabelText>
                      <CustomTextField
                        {...field}
                        placeholder="Industry type"
                        fullWidth
                        margin="none"
                      />
                    </Box>
                  )}
                />

                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      {" "}
                      <LabelText variant="subtitle1" component={"span"}>
                        Currency Symbol*
                      </LabelText>
                      <CustomTextField
                        {...field}
                        fullWidth
                        margin="none"
                        placeholder="$, €, ₹, AED"
                        error={!!errors.currency}
                        helperText={errors.currency?.message}
                      />
                    </Box>
                  )}
                />
              </Grid>
            </Grid>

            {/* Sign Up Button */}
            <Box textAlign="right" mt={2}>
              <Button type="submit" variant="contained" size="large">
                Sign Up
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <a href="/login">Login</a>
            </Typography>
          </Box>
        </Card>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          color: "#000000",
          // height: 20,
          display: "flex",
          // alignItems: "center",
          //   m:2,
          paddingTop: 2,
          paddingBottom: 1,
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &#169; 2025 InvoiceApp. All right reserved
        </Typography>
      </Box>
    </>
  );
}
