"use client";
import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const itemOptions = ["Item A", "Item B", "Item C", "Item D"];

const InvoiceTable = () => {
  const [rows, setRows] = useState([{ item: "", description: "", qty: "", rate: "", disc: 0 }]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleChange = (index, field, value) => {
    const newRows = [...rows];

    if (field === "qty" || field === "rate") {
      value = Number(value);
      if (value < 0) value = 0; // prevent negative
    }

    if (field === "disc") {
      value = Number(value);
      if (value < 0) value = 0;
      if (value > 100) value = 100; // restrict 0-100
    }

    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    if (!lastRow.item || lastRow.qty === "" || lastRow.rate === "") {
      alert("Please fill Item, Qty, and Rate in the last row before adding a new row.");
      return;
    }
    setRows([...rows, { item: "", description: "", qty: "", rate: "", disc: 0 }]);
  };

  const handleDelete = () => {
    if (selectedRow === null) return;
    const newRows = rows.filter((_, i) => i !== selectedRow);
    setRows(newRows.length ? newRows : [{ item: "", description: "", qty: "", rate: "", disc: 0 }]);
    setSelectedRow(null);
  };

  const calculateAmount = (row) => {
    const total = row.qty * row.rate;
    const discount = (total * row.disc) / 100;
    return isNaN(total - discount) ? 0 : total - discount;
  };

  const totalAmount = rows.reduce((acc, row) => acc + calculateAmount(row), 0);

  return (
    <Box sx={{ mt: 5, mx: "auto", width: { xs: "100%", sm: "95%" } }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Item*</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Qty*</TableCell>
              <TableCell>Rate*</TableCell>
              <TableCell>Disc %</TableCell>
              <TableCell>Amount</TableCell>
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
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <TextField
                    select
                    value={row.item}
                    onChange={(e) => handleChange(index, "item", e.target.value)}
                    fullWidth
                  >
                    {itemOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.qty}
                    onChange={(e) => handleChange(index, "qty", e.target.value)}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.rate}
                    onChange={(e) => handleChange(index, "rate", e.target.value)}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.disc}
                    onChange={(e) => handleChange(index, "disc", e.target.value)}
                    inputProps={{ min: 0, max: 100 }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>{calculateAmount(row).toFixed(2)}</TableCell>
              </TableRow>
            ))}

            {/* Total row */}
            <TableRow>
              <TableCell colSpan={6} align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  Total
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  value={totalAmount.toFixed(2)}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Buttons */}
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleAddRow}>
          Add Row
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={selectedRow === null}
        >
          Delete Selected
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceTable;
