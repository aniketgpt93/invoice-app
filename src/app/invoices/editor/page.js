"use client";

import { useEffect, useState } from "react";
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
  CircularProgress,
  MenuItem,
} from "@mui/material";

import { Add, Delete, ContentCopy } from "@mui/icons-material";
import CustomButton from "@/components/button/CustomButton";
import { CustomTextField, LabelText } from "@/components/SignupForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Header from "@/components/invoiceEditor/Header";
import EditorFooter from "@/components/invoiceEditor/EditorFooter";
import EditorTable from "@/components/invoiceEditor/EditorTable";

export default function InvoiceEditorPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
  const [rows, setRows] = useState([
    { item: "", description: "", qty: "", rate: "", disc: 0 },
  ]);

  const [totalAmountState, setTotalAmountState] = useState(0);
  const [taxState, setTaxState] = useState(0);

  const calcTotals = (taxPct) => {
    const calculatedTaxAmt =
      totalAmountState > 0
        ? parseFloat(((totalAmountState * taxPct) / 100).toFixed(2))
        : 0;
    const calculatedInvoiceAmt =
      totalAmountState > 0
        ? parseFloat((totalAmountState + calculatedTaxAmt).toFixed(2))
        : 0;

    return { taxPct, calculatedTaxAmt, calculatedInvoiceAmt };
  };
  const handleTaxPercentagehange = (e) => {
    let value = Number(e.target.value);

    value = Number(value);
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    const data = calcTotals(value);
    setTaxState(data);
  };

  const onSubmit = (data) => {
    console.log("Invoice saved", data);
  };

  console.log(taxState, "taxState");
  return (
    <ProtectedRoute>
      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <Header loading={loading} onClickFunc={() => handleSubmit(onSubmit)} />

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
        <EditorTable
          rows={rows}
          setRows={(e) => setRows(e)}
          totalAmountState={totalAmountState}
          setTotalAmountState={(e) => setTotalAmountState(e)}
        />

        <EditorFooter
          handleTaxPercentagehange={(e) => handleTaxPercentagehange(e)}
          totalAmountState={totalAmountState}
          taxState={taxState}
        />
      </Box>
    </ProtectedRoute>
  );
}
