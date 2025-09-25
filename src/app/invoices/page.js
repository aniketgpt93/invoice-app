"use client";
import React, { useEffect, useState } from "react";
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
import dayjs from "dayjs";
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
import axios from "axios";
import ErrorModal from "@/components/modal/ErrorModal";
import {
  getInvoiceList,
  getMetrics,
  getTopItems,
  getTrend12M,
} from "@/utils/axiosFile";
import { getFromDate } from "@/utils";
import LoaderComponent from "@/components/loader/LoaderComponent";
import { clearAuthData } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const filterOptions = ["Today", "Week", "Month", "Year", "Custom"];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const InvoicesDashboard = () => {
  const [filter, setFilter] = useState("Today");
  const [fromDate, setFromDate] = useState(getFromDate("Month").from);
  const [toDate, setToDate] = useState(getFromDate("Month").to);
  const { company } = useSelector((state) => state.auth);
  const [listData, setListData] = useState([]);
  const [metricsData, setMetricsData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [topItemsData, setTopItemsData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

    const handleErrorClose = () => {
    setErrorOpen(false);
    setErrorMessage("");
  };
  const columns = [
    { field: "invoiceNo", headerName: "Invoice No", flex: 1 },
    { field: "invoiceDate", headerName: "Date", flex: 1 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    { field: "itemsCount", headerName: "Items", type: "number", flex: 1 },
    { field: "subTotal", headerName: "Sub Total", type: "number", flex: 1 },
    { field: "taxPercentage", headerName: "Tax %", type: "number", flex: 1 },
    { field: "taxAmount", headerName: "Tax Amt", type: "number", flex: 1 },
    { field: "invoiceAmount", headerName: "Total", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="primary">
            <EditIcon
              onClick={() =>
                router.push(
                  `/invoices/editor?invoiceNo=${params?.row?.invoiceID}&heading=Edit`
                )
              }
            />
          </IconButton>
          <IconButton color="secondary">
            <PrintIcon />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon onClick={()=>handleDelete(params?.row?.invoiceID)}/>
          </IconButton>
        </>
      ),
    },
  ];

  const cardDetails = [
    {
      title: `${listData.length || 0}`,
      subtitle: "Number of invoices",
      variantH: "h4",
      content: null,
    },
    {
      title: `${company?.currencySymbol || ""} ${totalAmount}`,
      subtitle: "Total invoices amount",
      variantH: "h4",
      content: null,
    },
    {
      title: "Last 12 Months",
      variantH: "h6",
      content: (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={trendData}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <RechartTooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
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
              data={topItemsData}
              dataKey="value"
              nameKey="name"
              outerRadius={40}
              label
            >
              {topItemsData.map((entry, index) => (
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
  ];
  const handleDelete = async (invoiceNo) => {
    const token = sessionStorage.getItem("token");
    if (!confirm("Are you sure?")) return;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/Invoice/${invoiceNo}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    fetchDashboardData(fromDate, toDate);
  };
  const handleRangeChange = (newRange) => {
    setFilter(newRange);
    const { from, to } = getFromDate(newRange);
    setFromDate(from);
    setToDate(to);

    fetchDashboardData(from, to);
  };

  const fetchDashboardData = async (rangeFrom, rangeTo) => {
    try {
      setLoading(true);

      const [listRes, trendRes, topItemsRes, metricsRes] = await Promise.all([
        getInvoiceList(rangeFrom, rangeTo),
        // getMetrics(rangeFrom, rangeTo),
        getTrend12M(),
        getTopItems(rangeFrom, rangeTo),
      ]);
      console.log({ listRes, metricsRes, trendRes, topItemsRes });
      const resListData = (listRes.data || []).map((item) => ({
        id: item.primaryKeyID,
        invoiceNo: item.invoiceNo,
        invoiceDate: item.invoiceDate?.split("T")[0],
        customerName: item.customerName,
        itemsCount: item.itemsCount || 0,
        subTotal: item.subTotal,
        taxPercentage: item.taxPercentage,
        taxAmount: item.taxAmount,
        invoiceAmount: item.invoiceAmount,
        invoiceID: item.invoiceID,
      }));
      const sum = (listRes.data || []).reduce(
        (acc, item) => acc + (item.invoiceAmount || 0),
        0
      );
      setTotalAmount(sum.toFixed(2));
      const lineData = (trendRes.data || []).map((item) => ({
        month: dayjs(item.monthStart).format("MMM YYYY"), // Oct 2024
        total: item.amountSum,
      }));
      const pieData = (topItemsRes.data || []).map((item) => ({
        name: item.itemName,
        value: item.amountSum,
      }));
      setListData(resListData);
      // setMetricsData(metricsRes.data);
      setTrendData(lineData);
      setTopItemsData(pieData);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");

        dispatch(clearAuthData());
      } else {
        const msg =
          err.response?.data?.message || err.message || "Something went wrong!";
        setErrorMessage(msg);
        setErrorOpen(true);
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(fromDate, toDate);
  }, []);

  return (
    <ProtectedRoute>
      {loading && <LoaderComponent />}
      <ErrorModal
        open={errorOpen}
        onClose={handleErrorClose}
        message={errorMessage}
      />
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
                  onClick={() => handleRangeChange(option)}
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
          {listData.length == 0 && (
            <Grid size={{ xs: 12, sm: 12, md: 12, p: 12, m: 12}}>
              {" "}
              <Card
                sx={{
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: 1300,
                  height: 180,
                }}
              >
                <CardContent>
                  <Typography variant={"h6"}>Not have any data</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {listData.length > 0 &&
            cardDetails.map((card, index) => (
              <Grid
                item
                key={index}
                size={{ xs: 12, sm: 6, md: 3, p: 8, m: 5 }}
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
                    maxWidth: 280,
                    height: 180,
                  }}
                >
                  <CardContent>
                    <Typography variant={card.variantH}>
                      {card.title}
                    </Typography>
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
              sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" }, mr: 1 }}
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
            rows={listData}
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
