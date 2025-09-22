"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import NewItemModal from "@/components/modal/NewItem";
import axios from "axios";
import ErrorModal from "@/components/modal/ErrorModal";

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const handleErrorClose = () => {
    setErrorOpen(false);
    setErrorMessage("");
  };
  useEffect(() => {
    const ControllerName = "";
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/${ControllerName}/GetList`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong!";
        setErrorMessage(msg);
        setErrorOpen(true);
        console.error("Error fetching items:", error);
      });
  }, []);

  const filtered = items.filter(
    (i) =>
      i.itemName.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleAdd = () => {
    setModalMode("add");
    setOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/${ControllerName}/${item.id}`,
          {
            data: { id: item.id },
          }
        );

        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  const handleExport = () => {
    window.open("/item/export", "_blank");
  };

  return (
    <ProtectedRoute>
      <Box p={3}>
        <ErrorModal
          open={errorOpen}
          onClose={handleErrorClose}
          message={errorMessage}
        />
        <Box mb={1}>
          <Typography variant="h4">Items</Typography>
          <Typography variant="subtitle1">
            Manage your product and service catalog.
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <TextField
            size="small"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />

          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
            >
              Add New Item
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<ViewColumnIcon />}
              sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
            ></Button>
          </Box>
        </Box>

        <TableContainer component={Paper} mt={3} p={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Picture</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Sale Rate</TableCell>
                <TableCell align="right">Discount %</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={item.pictureUrl || "/images/default-img.png"}
                      alt="item"
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{item.itemName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.description || ""}>
                      <Typography noWrap>
                        {item.description?.substring(0, 50) || ""}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    {item.saleRate.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell align="right">
                    {item.discountPct.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
        <NewItemModal
          open={open}
          handleClose={handleClose}
          title={modalMode === "add" ? "New Item" : "Edit Item"}
          data={modalMode === "edit" ? selectedItem : null}
        />
      </Box>
    </ProtectedRoute>
  );
};

export default ItemsList;
