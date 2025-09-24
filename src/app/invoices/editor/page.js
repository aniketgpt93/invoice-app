"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import * as yup from "yup";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/invoiceEditor/Header";
import EditorFooter from "@/components/invoiceEditor/EditorFooter";
import EditorTable from "@/components/invoiceEditor/EditorTable";
import InvoiceForm from "@/components/invoiceEditor/InvoiceForm";
import LoaderComponent from "@/components/loader/LoaderComponent";
import {
  fetchItems,
  getInvoiceById,
  saveInvoice,
  updateInvoice,
} from "@/utils/axiosFile";
import { generateRandomNumber } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  invoiceNo: yup
    .number()
    .typeError("Invoice No must be a number")
    .required("Invoice No is required"),

  invoiceDate: yup.date().required("Invoice date is required"),

  customerName: yup
    .string()
    .transform((value) => (value ? value.trim() : value))
    .required("Customer name is required"),

  address: yup.string().transform((value) => (value ? value.trim() : value)),
  city: yup.string().transform((value) => (value ? value.trim() : value)),
  notes: yup.string().transform((value) => (value ? value.trim() : value)),
});

export default function InvoiceEditorPage() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [items, setItems] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceNo = searchParams.get("invoiceNo");
  const heading = searchParams.get("heading");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invoiceNo: generateRandomNumber(),
      invoiceDate: new Date().toISOString().split("T")[0],
      customerName: "",
      address: "",
      city: "",
      notes: "",
    },
  });

  const [rows, setRows] = useState([
    {
      rowNo: 0,
      itemID: 0,
      description: "",
      quantity: 0,
      rate: 0,
      discountPct: 0,
    },
  ]);

  const [totalAmountState, setTotalAmountState] = useState(0);
  const [taxState, setTaxState] = useState({
    taxPct: 0,
    calculatedTaxAmt: 0,
    calculatedInvoiceAmt: 0,
  });

  const calcTotals = (taxPct) => {
    const calculatedTaxAmt =
      totalAmountState > 0
        ? parseFloat(((totalAmountState * taxPct) / 100).toFixed(2))
        : 0;
    const calculatedInvoiceAmt =
      totalAmountState > 0
        ? parseFloat((totalAmountState + calculatedTaxAmt).toFixed(2))
        : 0;

    return { taxPct, calculatedTaxAmt, calculatedInvoiceAmt };
  };
  const updateInvoieAmount = () => {
    try {
      const data = calcTotals(taxState?.taxPct);
      setTaxState(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleTaxPercentagehange = (e) => {
    let value = Number(e.target.value);

    value = Number(value);
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    const data = calcTotals(value);
    setTaxState(data);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let payload = {
        ...data,
        invoiceDate: new Date(data.invoiceDate).toISOString().split("T")[0],
        lines: rows.map((r) => ({
          ...r,
          rate: Number(r.rate.toFixed(2)),
          discountPct: Number(r.discountPct.toFixed(2)),
        })),
        taxPercentage: taxState.taxPct || 0,
      };
      if (heading) {
        const result = await updateInvoice(payload);
        alert("Invoice uploded!");
      } else {
        const result = await saveInvoice(payload);
        alert("Invoice saved!");
      }

      router.push("/invoices");
      setLoading(false);
    } catch (error) {
      console.error(
        "Error saving invoice:",
        error.response?.data || error.message
      );
      alert(error.response?.data || error.message || "Error saving invoice!");
      setLoading(false);
    }
  };

  const fetchItemsFunc = async () => {
    try {
      setPageLoading(true);

      const updatedItems = await fetchItems();

      setItems(updatedItems);
      console.log(updatedItems, "updatedItems");
      loadInvoice(invoiceNo);
      setPageLoading(false);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      alert(msg);
      console.error("Error fetching items:", error);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized! Token may be expired or invalid.");
        sessionStorage.removeItem("token");
        router.push("/");
      } else {
        console.error("Error:", error);
      }
      setPageLoading(false);
    } finally {
      setPageLoading(false);
    }
  };
  const loadInvoice = async (id) => {
    if (invoiceNo) {
      const data = await getInvoiceById(id);
      // setValue("invoiceNo", data.invoiceNo);
      setValue("invoiceDate", data.invoiceDate.split("T")[0]);
      setValue("customerName", data.customerName);
      setValue("address", data.address);
      setValue("city", data.city);
      setValue("notes", data.notes);
      setRows(data.lines || []);
      setTotalAmountState(data.subTotal);

      setTaxState({
        taxPct: data.taxPercentage,
        calculatedTaxAmt: data.taxAmount,
        calculatedInvoiceAmt: data.invoiceAmount,
      });
    }
  };

  useEffect(() => {
    fetchItemsFunc();
  }, []);

  useEffect(() => {
    updateInvoieAmount();
  }, [totalAmountState]);

  return (
    <ProtectedRoute>
      {pageLoading && <LoaderComponent />}

      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <Header
          loading={loading}
          onClickFunc={handleSubmit(onSubmit)}
          heading={heading}
        />

        <InvoiceForm control={control} errors={errors} setValue={setValue} />
        <EditorTable
          rows={rows}
          setRows={(e) => setRows(e)}
          totalAmountState={totalAmountState}
          setTotalAmountState={(e) => setTotalAmountState(e)}
          items={items}
        />

        <EditorFooter
          handleTaxPercentagehange={(e) => handleTaxPercentagehange(e)}
          totalAmountState={totalAmountState}
          taxState={taxState}
        />
      </Box>
    </ProtectedRoute>
  );
}
