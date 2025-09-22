import { MenuItem, Paper, TableBody, TableCell, TableContainer, Typography, Box, Table, TableHead, TableRow } from "@mui/material";
import { CustomTextField } from "../SignupForm";
import CustomButton from "../button/CustomButton";
import { Add, ContentCopy, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";



export default function EditorTable ({rows, setRows, setTotalAmountState, totalAmountState}) {
  const [selectedRow, setSelectedRow] = useState(null);
     const headers = [
        "S.No",
        "Item*",
        "Description",
        "Qty*",
        "Rate*",
        "Disc %",
        "Amount",
      ];
       const itemOptions = ["Item A", "Item B", "Item C", "Item D"];
       

         const handleAddRow = () => {
           const lastRow = rows[rows.length - 1];
           if (!lastRow.item || lastRow.qty === "" || lastRow.rate === "") {
             alert(
               "Please fill Item, Qty, and Rate in the last row before adding a new row."
             );
             return;
           }
           setRows([
             ...rows,
             { item: "", description: "", qty: "", rate: "", disc: 0 },
           ]);
         };
       
         const handleDelete = () => {
           if (selectedRow === null) return;
           const newRows = rows.filter((_, i) => i !== selectedRow);
           setRows(
             newRows.length
               ? newRows
               : [{ item: "", description: "", qty: "", rate: "", disc: 0 }]
           );
           setSelectedRow(null);
         };
           const handleChange = (index, field, value) => {
             const newRows = [...rows];
         
             if (field === "qty" || field === "rate") {
               value = Number(value);
               if (value < 0) value = 0;
             }
         
             if (field === "disc") {
               value = Number(value);
               if (value < 0) value = 0;
               if (value > 100) value = 100;
             }
         
             newRows[index][field] = value;
             setRows(newRows);
           };
         
         
         
           const calculateAmount = (row) => {
             const total = row.qty * row.rate;
             const discount = (total * row.disc) / 100;
             return isNaN(total - discount) ? 0 : total - discount;
           };
           useEffect(() => {
             const total = rows.reduce((acc, row) => acc + calculateAmount(row), 0);
             setTotalAmountState(total);
           }, [rows]);
    return (
         <Paper sx={{ p: 2, mt: 2 }} elevation={3}>
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
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Line Items
                    </Typography>
                    <Box>
                      <CustomButton
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={(e) => handleAddRow(e)}
                      >
                        <Add /> Add Row
                      </CustomButton>
                      <CustomButton variant="outlined" sx={{ mr: 1 }}>
                        <ContentCopy /> Copy
                      </CustomButton>
        
                      <CustomButton
                        onClick={(e) => handleDelete(e)}
                        disabled={selectedRow === null}
                      >
                        <Delete sx={{ mr: { xs: 0.5, sm: 1 } }} /> Delete
                      </CustomButton>
                    </Box>
                  </Box>
        
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map((header) => (
                            <TableCell
                              key={header}
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                              }}
                            >
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow
                            key={index}
                            hover
                            selected={selectedRow === index}
                            onClick={() => setSelectedRow(index)}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem", // ya jo aapke table ka default hai
                              }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem", // ya jo aapke table ka default hai
                              }}
                            >
                              <CustomTextField
                                select
                                value={row.item}
                                onChange={(e) =>
                                  handleChange(index, "item", e.target.value)
                                }
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
                              >
                                {itemOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </CustomTextField>
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem", // ya jo aapke table ka default hai
                              }}
                            >
                              <CustomTextField
                                placeholder="Discription"
                                value={row.description}
                                onChange={(e) =>
                                  handleChange(index, "description", e.target.value)
                                }
                                fullWidth
                                margin="none"
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem", // ya jo aapke table ka default hai
                              }}
                            >
                              <CustomTextField
                                placeholder="0.00"
                                type="number"
                                value={row.qty}
                                onChange={(e) =>
                                  handleChange(index, "qty", e.target.value)
                                }
                                inputProps={{ min: 0 }}
                                fullWidth
                                margin="none"
                                sx={{
                                  "& .MuiInputBase-input::placeholder": {
                                    textAlign: "right",
                                  },
                                  "& .MuiInputBase-input": {
                                    textAlign: "right",
                                  },
                                  maxWidth: 80,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem", // ya jo aapke table ka default hai
                              }}
                            >
                              <CustomTextField
                                placeholder="0.00"
                                type="number"
                                value={row.rate}
                                onChange={(e) =>
                                  handleChange(index, "rate", e.target.value)
                                }
                                inputProps={{ min: 0 }}
                                fullWidth
                                margin="none"
                                sx={{
                                  "& .MuiInputBase-input::placeholder": {
                                    textAlign: "right",
                                  },
                                  "& .MuiInputBase-input": {
                                    textAlign: "right",
                                  },
                                  maxWidth: 80,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "0.875rem", // ya jo aapke table ka default hai
                              }}
                            >
                              <CustomTextField
                                placeholder="0.00"
                                type="number"
                                value={row.disc}
                                onChange={(e) =>
                                  handleChange(index, "disc", e.target.value)
                                }
                                inputProps={{ min: 0, max: 100 }}
                                fullWidth
                                margin="none"
                                sx={{
                                  "& .MuiInputBase-input::placeholder": {
                                    textAlign: "right",
                                  },
                                  "& .MuiInputBase-input": {
                                    textAlign: "right",
                                  },
                                  maxWidth: 80,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                              }}
                            >
                              {calculateAmount(row).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
        
                        <TableRow 
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f5f5f5",
                          }}
                        >
                          <TableCell
                            colSpan={6}
                            align="right"
                            sx={{
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              Total
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: "0.875rem", 
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#f5f5f5",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              {totalAmountState.toFixed(2)}
                            </Typography>
                            {/* <CustomTextField
                              placeholder="$0.00"
                              value={totalAmountState.toFixed(2)}
                              InputProps={{ readOnly: true }}
                              fullWidth
                              variant="outlined"
                              margin="none"
                              sx={{
                                   fontWeight: "bold",
                fontSize: "0.875rem",
                                "& .MuiInputBase-input::placeholder": {
                                  textAlign: "right",
                                },
                                "& .MuiInputBase-input": {
                                  textAlign: "right",
                                },
                               
                              }}
                            /> */}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
    )
}