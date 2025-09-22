import { Box, Paper, Typography } from "@mui/material";
import { CustomTextField } from "../SignupForm";



export default function EditorFooter ({taxState, totalAmountState, handleTaxPercentagehange}){


    return (<Paper sx={{ p: 2, mt: 2, mb: 3 }} elevation={3}>
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
                value={totalAmountState.toFixed(2)}
                InputProps={{ readOnly: true }}
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
              }}
            >
              <Typography variant="body2" sx={{ mr: 2 }}>
                Tax
              </Typography>
              <Box display="flex" gap={2} flex={1}>
                <CustomTextField
                  placeholder="0.00 %"
                 value={taxState?.taxPct ?? ""}
                  onChange={handleTaxPercentagehange}
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
                  value={taxState?.calculatedTaxAmt ?? ""}
                  InputProps={{ readOnly: true }}
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
                borderRadius: 2,
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
               $ {taxState?.calculatedInvoiceAmt || 0.00}
              </Typography>
            </Box>
          </Box>
        </Paper>)
}