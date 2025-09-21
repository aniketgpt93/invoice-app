"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

// import { Controller } from "react-hook-form";
// import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete, ContentCopy } from "@mui/icons-material";
import { CustomTextField, LabelText } from "@/app/signup/page";
import CustomButton from "@/component/button/CustomButton";

export default function InvoiceEditorPage() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceNo: "INV-001",
      invoiceDate: new Date().toISOString().split("T")[0],
      customerName: "",
      address: "",
      city: "",
      notes: "",
      items: [
        { item: "", description: "", qty: 0, rate: 0, disc: 0, amount: 0 },
      ],
      subTotal: 0,
      taxPct: 0,
      taxAmt: 0,
      invoiceAmt: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const calcTotals = (items, taxPct, taxAmt) => {
    const subTotal = items.reduce((sum, it) => sum + it.amount, 0);
    let tAmt = taxAmt;
    let tPct = taxPct;

    if (taxPct > 0) {
      tAmt = parseFloat(((subTotal * taxPct) / 100).toFixed(2));
    } else if (taxAmt > 0 && subTotal > 0) {
      tPct = parseFloat(((taxAmt * 100) / subTotal).toFixed(2));
    } else if (subTotal === 0) {
      tPct = 0;
      tAmt = 0;
    }

    const invoiceAmt = subTotal + tAmt;
    return { subTotal, taxPct: tPct, taxAmt: tAmt, invoiceAmt };
  };

  const onSubmit = (data) => {
    console.log("Invoice saved", data);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#fff", 
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6">New Invoice</Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Box>
      </Box>


      <Paper sx={{ p: 2, mt: 2 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Invoice Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Controller
              name="invoiceNo"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Invoice No
                  </LabelText>
                  <CustomTextField
                    placeholder="INV-001"
                    {...field}
                    fullWidth
                    error={!!errors.invoiceNo}
                    helperText={errors.invoiceNo?.message}
                  />
                </Box>
              )}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Controller
              name="invoiceDate"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Invoice Date
                  </LabelText>
                  <CustomTextField
                    {...field}
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.invoiceDate}
                    helperText={errors.invoiceDate?.message}
                  />
                </Box>
              )}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Controller
              name="customerName"
              control={control}
              rules={{ required: "Enter name." }}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Coustomer
                  </LabelText>
                  <CustomTextField
                    {...field}
                    fullWidth
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                  />
                </Box>
              )}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
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
          <Grid item size={{ xs: 12, md: 6 }}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Address
                  </LabelText>
                  <TextField
                    {...field}
                    fullWidth
                    margin="none"
                    variant="outlined"
                    placeholder="Enter address"
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
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText variant="subtitle1" component={"span"}>
                    Notes
                  </LabelText>
                  <TextField
                    {...field}
                    fullWidth
                    margin="none"
                    variant="outlined"
                    placeholder="Additional notes"
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
          </Grid>
        </Grid>
      </Paper>

      {/* Line Items Grid */}
      <Paper sx={{ p: 2, mt: 2 }} elevation={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: "#fff", // <-- override parent
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Line Items
          </Typography>
          <Box>
            <CustomButton variant="outlined" sx={{ mr: 1 }}>
              <Add /> Add Row
            </CustomButton>
            <CustomButton variant="outlined" sx={{ mr: 1 }}>
              <ContentCopy /> Copy
            </CustomButton>

            <CustomButton>
              <Delete sx={{ mr: { xs: 0.5, sm: 1 } }} /> Delete
            </CustomButton>
          </Box>
        </Box>

        {/* <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Field</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Invoice No</TableCell>
                <TableCell>
                  <Controller
                    name="invoiceNo"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        placeholder="INV-001"
                        {...field}
                        fullWidth
                        error={!!errors.invoiceNo}
                        helperText={errors.invoiceNo?.message}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Invoice Date</TableCell>
                <TableCell>
                  <Controller
                    name="invoiceDate"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.invoiceDate}
                        helperText={errors.invoiceDate?.message}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>
                  <Controller
                    name="customerName"
                    control={control}
                    rules={{ required: "Enter name." }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>City</TableCell>
                <TableCell>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        placeholder="Enter city"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="Enter address"
                        multiline
                        minRows={2}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Notes</TableCell>
                <TableCell>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="Additional notes"
                        multiline
                        minRows={2}
                        error={!!errors.notes}
                        helperText={errors.notes?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
      </Paper>

      {/* Totals */}

      <Paper sx={{ p: 2, mt: 2, mb: 3 }} elevation={3}>
        {/* Header */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Invoice Totals
        </Typography>
        <Box
          mt={3}
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap={1}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            sx={{ width: "100%", maxWidth: 300 }}
          >
            {/* Label */}
            <Typography
              variant="body2"
              sx={{
                flex: { xs: "unset", sm: 1 },
                mb: { xs: 1, sm: 0 },
              }}
            >
              SubTotal
            </Typography>

            <CustomTextField
              placeholder="0.00 %"
              disabled
              margin="none"
              sx={{
                width: { xs: "100%", sm: "100px" },
                "& .MuiInputBase-input::placeholder": {
                  textAlign: "right",
                },
                "& .MuiInputBase-input": {
                  textAlign: "right",
                },
              }}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
              maxWidth: 300,
              borderBottom: "1px solid #e0e0e0",
              //   width: "300px",
            }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              New Invoice
            </Typography>
            <Box display="flex" gap={2} flex={1}>
              <CustomTextField
                placeholder="0.00 %"
                fullWidth
                margin="none"
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "right",
                  },
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                  },
                }}
              />
              <CustomTextField
                placeholder="$0.00"
                fullWidth
                margin="none"
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    textAlign: "right",
                  },
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                  },
                }}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              //   backgroundColor: "#fff",
              //   p: 2,
              borderRadius: 2,
              //   boxShadow: 1,
              //   borderBottom: "1px solid #e0e0e0",
              fontWeight: "bold",
              bgcolor: "#f5f5f5",
              width: "300px",
              width: "100%",
              maxWidth: 300,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                bgcolor: "#f5f5f5",
                p: 1,
                borderRadius: 1,
              }}
            >
              Invoice Amount
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                bgcolor: "#f5f5f5",
                p: 1,
                borderRadius: 1,
              }}
            >
              $0.00
            </Typography>
          </Box>
        </Box>

        {/* <Grid container spacing={2}>
          <Grid item size={{ xs: 8 }}>12121112</Grid>
          <Grid itemsize={{ xs: 4 }}>
            <TextField label="Sub Total" fullWidth disabled />
          </Grid>

          <Grid item size={{ xs: 8 }}>bjbnjkjkbnkjb</Grid>
          <Grid item size={{xs:12,sm:4}} >
             <Grid container spacing={0.5}>
                  <Grid item size={{ xs: 4 }}>
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
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item size={{ xs: 4 }}>
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
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
            
          </Grid>

          <Grid item size={{ xs: 8 }}>bjbnjkjkbnkjb</Grid>
          <Grid item size={{xs:12}}>
            <Typography
              variant="h6"
              align="right"
              sx={{
                fontWeight: "bold",
                bgcolor: "#f5f5f5",
                p: 1,
                borderRadius: 1,
              }}
            >
              Invoice Amount: $0.00
            </Typography>
          </Grid>
        </Grid> */}
      </Paper>
    </Box>
  );
}
