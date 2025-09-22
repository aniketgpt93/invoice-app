import { Box, Grid, Paper, TextField, Typography } from "@mui/material"
import { Controller } from "react-hook-form"
import { CustomTextField, LabelText } from "../SignupForm"



export default function InvoiceForm({control, errors }){
    return (
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
    )
}