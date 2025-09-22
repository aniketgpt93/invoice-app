"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
} from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Header from "@/components/invoiceEditor/Header";
import EditorFooter from "@/components/invoiceEditor/EditorFooter";
import EditorTable from "@/components/invoiceEditor/EditorTable";
import InvoiceForm from "@/components/invoiceEditor/InvoiceForm";

export default function InvoiceEditorPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceNo: "INV-001",
      invoiceDate: new Date().toISOString().split("T")[0],
      customerName: "",
      address: "",
      city: "",
      notes: "",
    },
  });
  const [rows, setRows] = useState([
    { item: "", description: "", qty: "", rate: "", disc: 0 },
  ]);

  const [totalAmountState, setTotalAmountState] = useState(0);
  const [taxState, setTaxState] = useState(0);

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
  const handleTaxPercentagehange = (e) => {
    let value = Number(e.target.value);

    value = Number(value);
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    const data = calcTotals(value);
    setTaxState(data);
  };

  const onSubmit = (data) => {
    console.log("Invoice saved", data);
  };


  return (
    <ProtectedRoute>
      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <Header loading={loading} onClickFunc={() => handleSubmit(onSubmit)} />

       <InvoiceForm  control={control} errors={errors} setValue={setValue}/>
        <EditorTable
          rows={rows}
          setRows={(e) => setRows(e)}
          totalAmountState={totalAmountState}
          setTotalAmountState={(e) => setTotalAmountState(e)}
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
