"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const filterOptions = ["Today", "Week", "Month", "Year", "Custom"];

const dummyInvoices = [
  {
    id: 1,
    InvoiceNo: "INV-001",
    InvoiceDate: "2025-09-21",
    CustomerName: "John Doe",
    ItemsCount: 3,
    SubTotal: 1500,
    TaxPercentage: 18,
    TaxAmount: 270,
    InvoiceAmount: 1770,
  },
  {
    id: 2,
    InvoiceNo: "INV-002",
    InvoiceDate: "2025-09-20",
    CustomerName: "Jane Smith",
    ItemsCount: 2,
    SubTotal: 1000,
    TaxPercentage: 10,
    TaxAmount: 100,
    InvoiceAmount: 1100,
  },
];

const lineData = [
  { month: "Oct 24", total: 1200 },
  { month: "Nov 24", total: 1500 },
  { month: "Dec 24", total: 1800 },
  { month: "Jan 25", total: 1400 },
  { month: "Feb 25", total: 1700 },
  { month: "Mar 25", total: 2000 },
];

const pieData = [
  { name: "Item A", value: 400 },
  { name: "Item B", value: 300 },
  { name: "Item C", value: 300 },
  { name: "Others", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const columns = [
  { field: "InvoiceNo", headerName: "Invoice No", flex: 1 },
  { field: "InvoiceDate", headerName: "Date", flex: 1 },
  { field: "CustomerName", headerName: "Customer", flex: 1 },
  { field: "ItemsCount", headerName: "Items", type: "number", flex: 1 },
  { field: "SubTotal", headerName: "Sub Total", type: "number", flex: 1 },
  { field: "TaxPercentage", headerName: "Tax %", type: "number", flex: 1 },
  { field: "TaxAmount", headerName: "Tax Amt", type: "number", flex: 1 },
  { field: "InvoiceAmount", headerName: "Total", type: "number", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: (params) => (
      <>
        <IconButton color="primary">
          <EditIcon />
        </IconButton>
        <IconButton color="secondary">
          <PrintIcon />
        </IconButton>
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
];
 const cardDetails = [ 
    {
      title: "12",
      subtitle: "Number of invoices",
      variantH: "h4",
      content: null,
    },
    {
      title: "₹ 25,000",
      subtitle: "Total invoices amount",
      variantH: "h4",
      content: null,
    },
    {
      title: "Last 12 Months",
      variantH: "h6",
      content: (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={lineData}>
            <XAxis dataKey="month" />
            <YAxis />
            <RechartTooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Top Items",
      variantH: "h6",
      content: (
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={40}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <RechartTooltip />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
  ]
const InvoicesDashboard = () => {
  const [filter, setFilter] = useState("Today");
  const [search, setSearch] = useState("");
    const router = useRouter();


  return (
    <ProtectedRoute>
      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            backgroundColor: "#fff",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h4">Invoices</Typography>

          <Box display="flex" gap={1}>
            {filterOptions.map((option) => {
              const isActive = filter === option;

              return (
                <Button
                  key={option}
                  size="small"
                  variant={isActive ? "contained" : "outlined"}
                  onClick={() => setFilter(option)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "0.8rem",
                    px: 2,

                    // 🔑 sirf color control
                    ...(isActive
                      ? {
                          bgcolor: "black",
                          color: "white",
                          "&:hover": { bgcolor: "#333" },
                        }
                      : {
                          color: "black",
                          borderColor: "black",
                          "&:hover": {
                            borderColor: "black",
                            bgcolor: "rgba(0,0,0,0.04)",
                          },
                        }),
                  }}
                >
                  {option}
                </Button>
              );
            })}
          </Box>
        </Box>

<Grid
  container
  spacing={2}
  mb={3}
  sx={{
    flexWrap: { xs: "wrap", md: "nowrap" }, 
    justifyContent: "space-between",       
  }}
>
  {cardDetails.map((card, index) => (
    <Grid
      item
      key={index}
      size={{ xs: 12, sm: 6, md: 3 ,p:8, m:5}}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
          width: "100%",
          maxWidth: 280,  // card thoda chhota dikhne ke liye
          height: 180,    // same height
        }}
      >
        <CardContent>
          <Typography variant={card.variantH}>{card.title}</Typography>
          {card.subtitle && (
            <Typography variant="body2">{card.subtitle}</Typography>
          )}
          {card.content}
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

        <Box
          display="flex"
          justifyContent="space-between"
          pt={4}
          alignItems="center"
          mb={2}
        >
          <TextField
            placeholder="Search by Invoice No, Name"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } ,mr:1}}
              onClick={() => router.push("/invoices/editor")}
            >
              New Invoice
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                mr: { xs: 0, sm: 1 },
                px: { xs: 1.5, sm: 3 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              sx={{
                mr: { xs: 0, sm: 1 },
                px: { xs: 1.5, sm: 3 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              Column
            </Button>
          </Box>
        </Box>

        <Box height={400}>
          <DataGrid
            rows={dummyInvoices}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default InvoicesDashboard;
