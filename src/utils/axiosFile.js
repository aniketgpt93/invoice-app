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
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be expired or invalid.");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Error:", error);
    }
    throw error;
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
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be expired or invalid.");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};

export const deleteItem = async (item) => {
  try {
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
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be expired or invalid.");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
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
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/Invoice/GetMetrices?fromDate=${from}&toDate=${to}`,
    {
      // params: { fromDate: from, toDate: to },
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
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


export const updateInvoice = async (payload) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/Invoice/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be expired or invalid.");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};

export const checkDuplicateItemName = async (itemName) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Item/CheckDuplicateItemName`,
      {
        params: { ItemName: itemName },
        headers: {
          "Content-Type": "text/plain",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    if(error.response && error.response.status === 409)return true
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be expired or invalid.");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    
        if(error.response && error.response.status === 409)return true
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be expired or invalid.");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};
