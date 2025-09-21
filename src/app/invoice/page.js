'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer } from 'recharts';

const filterOptions = ['Today', 'Week', 'Month', 'Year', 'Custom'];

const dummyInvoices = [
  {
    id: 1,
    InvoiceNo: 'INV-001',
    InvoiceDate: '2025-09-21',
    CustomerName: 'John Doe',
    ItemsCount: 3,
    SubTotal: 1500,
    TaxPercentage: 18,
    TaxAmount: 270,
    InvoiceAmount: 1770,
  },
  {
    id: 2,
    InvoiceNo: 'INV-002',
    InvoiceDate: '2025-09-20',
    CustomerName: 'Jane Smith',
    ItemsCount: 2,
    SubTotal: 1000,
    TaxPercentage: 10,
    TaxAmount: 100,
    InvoiceAmount: 1100,
  },
];

const lineData = [
  { month: 'Oct 24', total: 1200 },
  { month: 'Nov 24', total: 1500 },
  { month: 'Dec 24', total: 1800 },
  { month: 'Jan 25', total: 1400 },
  { month: 'Feb 25', total: 1700 },
  { month: 'Mar 25', total: 2000 },
];

const pieData = [
  { name: 'Item A', value: 400 },
  { name: 'Item B', value: 300 },
  { name: 'Item C', value: 300 },
  { name: 'Others', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const columns = [
  { field: 'InvoiceNo', headerName: 'Invoice No', flex: 1 },
  { field: 'InvoiceDate', headerName: 'Date', flex: 1 },
  { field: 'CustomerName', headerName: 'Customer', flex: 1 },
  { field: 'ItemsCount', headerName: 'Items', type: 'number', flex: 1 },
  { field: 'SubTotal', headerName: 'Sub Total', type: 'number', flex: 1 },
  { field: 'TaxPercentage', headerName: 'Tax %', type: 'number', flex: 1 },
  { field: 'TaxAmount', headerName: 'Tax Amt', type: 'number', flex: 1 },
  { field: 'InvoiceAmount', headerName: 'Total', type: 'number', flex: 1 },
  {
    field: 'actions',
    headerName: 'Actions',
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

const InvoicesDashboard = () => {
  const [filter, setFilter] = useState('Today');
  const [search, setSearch] = useState('');

  return (
    <Box  sx={{backgroundColor: "#f5f5f5",}}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{
      backgroundColor: "#fff",   // <-- override parent
      p: 2,
      borderRadius: 2,
      boxShadow: 1,
      borderBottom:"1px solid #e0e0e0"
    }}>
        <Typography variant="h4">Invoices</Typography>
        {/* <TextField
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        > */}
       <Box display="flex" gap={1}>
  {filterOptions.map((option) => (
    <Button
      key={option}
      size="small"
      variant={filter === option ? "contained" : "outlined"}
      onClick={() => setFilter(option)}
      sx={{
        borderRadius: '20px',
        textTransform: 'none', 
        fontSize: '0.8rem',
        paddingX: 2,
      }}
    >
      {option}
    </Button>
  ))}
</Box>

        {/* </TextField> */}
      </Box>

      {/* Cards */}
     <Grid container spacing={3} mb={3}>
  <Grid item xs={12} sm={6} md={3} sx={{ display: "flex",width:"19rem" }}>
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}>
      <CardContent>
        {/* <Typography variant="h6"># Invoices</Typography> */}
        <Typography variant="h4">12</Typography>
        <Typography variant="body2">Number of invoices</Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", width:"19rem" }}>
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}>
      <CardContent>
        <Typography variant="h4">₹ 25,000</Typography>
            <Typography variant="body2">Total invoices amount</Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={6} md={3} sx={{ display: "flex",width:"19rem" }}>
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}>
      <CardContent>
        <Typography variant="h6">Last 12 Months</Typography>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={lineData}>
            <XAxis dataKey="month" />
            <YAxis />
            <RechartTooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={6} md={3} sx={{ display: "flex",width:"19rem" }}>
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}>
      <CardContent>
        <Typography variant="h6">Top Items</Typography>
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={40} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartTooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </Grid>
</Grid>

      <Box display="flex" justifyContent="space-between" pt={4} alignItems="center" mb={2}>
        <TextField
          placeholder="Search by Invoice No, Name"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>New Invoice</Button>
          <Button variant="outlined" color="secondary" sx={{ mr: 1 }}>Export</Button>
          <Button variant="outlined">Column Chooser</Button>
        </Box>
      </Box>

      {/* Grid */}
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
  );
};

export default InvoicesDashboard;
