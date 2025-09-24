import {
  MenuItem,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
} from "@mui/material";
import { CustomTextField } from "../SignupForm";
import CustomButton from "../button/CustomButton";
import { Add, ContentCopy, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function EditorTable({
  rows,
  setRows,
  setTotalAmountState,
  totalAmountState,
  items = [],
}) {
  console.log(rows, "rows rows");
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

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    if (!lastRow.itemID || lastRow.quantity === "" || lastRow.rate === "") {
      alert(
        "Please fill Item, Qty, and Rate in the last row before adding a new row."
      );
      return;
    }
    setRows([
      ...rows,
      {
        rowNo: rows.length + 1,
        itemID: 0,
        description: "",
        quantity: 0,
        rate: 0,
        discountPct: 0,
      },
    ]);
  };

  const handleDelete = () => {
    if (selectedRow === null) return;
    const newRows = rows
      .filter((_, i) => i !== selectedRow)
      .map((r, i) => ({
        ...r,
        rowNo: i + 1, // reset rowNo
      }));
    setRows(
      newRows.length
        ? newRows
        : [
            {
              rowNo: 1,
              itemID: 0,
              description: "",
              quantity: 0,
              rate: 0,
              discountPct: 0,
            },
          ]
    );
    setSelectedRow(null);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];

    if (field === "quantity" || field === "rate") {
      value = Number(value);
      if (value < 0) value = 0;
    }

    if (field === "discountPct") {
      value = Number(value);
      if (value < 0) value = 0;
      if (value > 100) value = 100;
    }

    newRows[index][field] = value;
    setRows(newRows);
  };

  const calculateAmount = (row) => {
    const total = row.quantity * row.rate;
    const discount = (total * row.discountPct) / 100;
    return isNaN(total - discount) ? 0 : total - discount;
  };
  const handleCopy = () => {
    if (selectedRow === null) return;

    const rowToCopy = rows[selectedRow];
    const newRow = {
      ...rowToCopy,
      rowNo: rows.length + 1,
    };

    setRows([...rows, newRow]);
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
          <CustomButton
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={handleCopy}
            disabled={selectedRow === null}
          >
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
                    fontSize: "0.875rem",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                  }}
                >
                  <CustomTextField
                    select
                    value={row.itemID || 0}
                    onChange={(e) =>
                      handleChange(index, "itemID", e.target.value)
                    }
                    SelectProps={{
                      renderValue: (selected) => {
                        const found = items.find(
                          (opt) => opt.itemID === selected
                        );
                        return found ? found.itemName : "";
                      },
                    }}
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
                    {(items || []).map((option) => (
                      <MenuItem key={option.itemID} value={option.itemID}>
                        {option.itemName}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
                  }}
                >
                  <CustomTextField
                    placeholder="0.00"
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
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
                    value={row.discountPct}
                    onChange={(e) =>
                      handleChange(index, "discountPct", e.target.value)
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
  );
}
