import axios from "axios";

export const fetchItems = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("No auth token found in sessionStorage");

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Item/GetList`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || error.message || "Something went wrong!";
    alert(msg);
    console.error("Error fetching items:", error);
  }
};

export const getItemThumbnail = async (itemId) => {
  try {
    const token = sessionStorage.getItem("token"); // 🔑 token from session

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Item/PictureThumbnail/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 token in header
        },
      }
    );

    console.log("✅ Thumbnail Response:", response.data);
    return response.data;
  } catch (error) {
    const msg =
      error.response.data ||
      error.request ||
      error.message ||
      "Somthing went worang";
    alert(msg);
  }
};

export const deleteItem = async (item) => {
  const token = sessionStorage.getItem("token");
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/Item/${item.itemID}`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const saveInvoice = async (invoiceData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/Invoice/`,
      invoiceData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    console.log("Invoice saved:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error saving invoice:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getInvoiceList = (from, to) => {
  const token = sessionStorage.getItem("token");
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Invoice/GetList`, {
    params: { fromDate: from, toDate: to },
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const getMetrics = (from, to) => {
  const token = sessionStorage.getItem("token");
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Invoice/GetMetrics`, {
    params: { fromDate: from, toDate: to },
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const getTrend12M = () => {
  const token = sessionStorage.getItem("token");
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Invoice/GetTrend12M`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const getTopItems = (from, to) => {
  const token = sessionStorage.getItem("token");
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Invoice/TopItems`, {
    params: { fromDate: from, toDate: to },
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

 export const handleDelete = async (invoiceNo) => {
    
  const token = sessionStorage.getItem("token");
    if (!confirm("Are you sure?")) return;
    await axios.delete(`${API_BASE}/Invoice/${invoiceNo}`, { headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },});
    fetchDashboardData(fromDate, toDate);
  };

