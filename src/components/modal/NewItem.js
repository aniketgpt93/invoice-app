import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  styled,
  InputAdornment,
} from "@mui/material";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import ErrorModal from "./ErrorModal";
import axios from "axios";
import { checkDuplicateItemName } from "@/utils/axiosFile";

const schema = yup.object().shape({
  itemName: yup.string().required("Item name is required"),
  description: yup
    .string()
    .required("Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  salesRate: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : Number(originalValue)
    )
    .typeError("Sale rate must be a number")
    .min(0, "Sale rate must be ≥ 0")
    .required("Sale rate is required"),
  discountPct: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : Number(originalValue)
    )
    .typeError("Discount must be a number")
    .min(0, "Discount must be ≥ 0")
    .max(100, "Discount must be ≤ 100")
    .required("Discount is required"),
  image: yup.mixed().nullable(),
});

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "40px",
    "& input": {
      padding: "8px 12px",
    },
  },
});

const LabelText = styled(Typography)({
  display: "block",
  marginBottom: 0,
  fontWeight: "bold",
  fontSize: "0.85rem",
});
export default function NewItemModal({
  open,
  handleClose,
  title = "New Item",
  data,
  rowFunc,
}) {
  const [imageName, setImageName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const handleErrorClose = () => {
    setErrorOpen(false);
    setErrorMessage("");
  };
  console.log(data, "data");
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      itemName: "",
      description: "",
      salesRate: "",
      discountPct: "",
      image: null,
    },
  });

  const fetchImg = async () => {
    if (data.itemID) {
      const token = sessionStorage.getItem("token");
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/Item/PictureThumbnail/${data.itemID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setPreviewUrl(res.data || null);
        })
        .catch((err) => {
          setPreviewUrl(null);
        });
    }
  };

  const updateItemPicture = async (fileInput) => {
    try {
      const token = sessionStorage.getItem("token");
      if (data && fileInput) {
        const formData = new FormData();
        formData.append("ItemID", data.itemID);
        formData.append("File", fileInput.files[0]);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/Item/UpdateItemPicture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchImg();
        alert("Upload image sucessfully");
        return response.data;
      }
    } catch (error) {
      const msg =
        error.response.data ||
        error.message ||
        error.request ||
        "Some thing went worang";
      alert(msg);
    }
  };

  const onSubmit = async (formData) => {
    try {
      let url = "";
      let payload = {};
      const token = sessionStorage.getItem("token");

      let checkItemName = false;

      if (data) {
        if (
          formData.itemName == data.itemName &&
          formData.description == data.description &&
          formData.salesRate == data.salesRate &&
          formData.discountPct == data.discountPct
        ) {
          alert("any text field on changes required");
        } else {
          url = `${process.env.NEXT_PUBLIC_API_URL}/Item`;
          payload = {
            updatedOn: null,
            itemID: data.itemID,
            itemName: formData.itemName?.trim() || "",
            description: formData.description?.trim() || "",
            salesRate: parseFloat(formData.salesRate),
            discountPct: parseFloat(formData.discountPct),
          };

          const res = await axios.put(url, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          rowFunc(payload);
          handleClose();
          alert("Item Saved sucessfully");
        }
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/Item`;
        payload = {
          itemName: formData.itemName?.trim() || "",
          description: formData.description?.trim() || "",
          salesRate: parseFloat(formData.salesRate),
          discountPct: parseFloat(formData.discountPct),
        };
        checkItemName = await checkDuplicateItemName(formData.itemName);
        if (!checkItemName) {
          const res = await axios.post(url, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("✅ API Success:", res.data);
          payload = { ...payload, primaryKeyID: res?.data?.primaryKeyID };
          rowFunc(payload);
          handleClose();
          alert("Item Saved sucessfully");
        }
      }
      if (checkItemName) {
        alert("Duplicate item name not accepted.");
      }
    } catch (error) {
      console.error("API Error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      setErrorMessage(msg);
      setErrorOpen(true);
    }
  };
  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          itemName: data.itemName || "",
          description: data.description || "",
          salesRate: data.salesRate || "",
          discountPct: data.discountPct || "",
          image: null,
        });

        setImageName(null);
      } else {
        reset({
          itemName: "",
          description: "",
          salesRate: "",
          discountPct: "",
          image: null,
        });
        setPreviewUrl(null);
        setImageName(null);
      }
    }
  }, [open, data, reset]);
  
  return (
    <>
      <ErrorModal
        open={errorOpen}
        onClose={handleErrorClose}
        message={errorMessage}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderBottom: "0.5px solid black",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="image"
              control={control}
              render={() => (
                <Box my={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <label htmlFor="upload-input">
                      <Box
                        component="img"
                        src={previewUrl || "/images/default-img.png"}
                        alt="item"
                        width={80}
                        height={80}
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "0.5px solid black",
                          cursor: "pointer",
                        }}
                      />
                    </label>

                    <input
                      id="upload-input"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("File size should not exceed 5MB");

                            return;
                          }

                          if (data?.itemID) {
                            updateItemPicture(e.target);
                            return;
                          }

                          setValue("image", file);
                          setImageName(file.name);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />

                    {!previewUrl && (
                      <Box sx={{ flex: previewUrl ? 1 : "unset" }}>
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            border: "0.2px solid black",
                          }}
                        >
                          {imageName || "No file chosen"}
                        </Typography>
                        <Typography variant="body2">
                          PNG or JPG, max 5MB
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {errors.image && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors.image.message}
                    </Typography>
                  )}
                </Box>
              )}
            />

            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 1 }}>
                  <LabelText>Item Name*</LabelText>
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder="Enter item name"
                    margin="none"
                    error={!!errors.itemName}
                    helperText={errors.itemName?.message}
                  />
                </Box>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                const currentLength = field.value?.length || 0;
                const maxLength = 500;

                return (
                  <Box sx={{ mb: 1 }}>
                    <LabelText>Description*</LabelText>
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      placeholder="Enter item description"
                      rows={4}
                      margin="none"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      inputProps={{ maxLength }}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={0.5}>
                      <span
                        style={{
                          fontSize: "12px",
                          color: currentLength > maxLength ? "red" : "gray",
                        }}
                      >
                        {currentLength}/{maxLength}
                      </span>
                    </Box>
                  </Box>
                );
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="salesRate"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText>Sale Rate*</LabelText>
                      <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        margin="none"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        sx={{
                          "& .MuiInputBase-input": { textAlign: "right" },
                        }}
                        error={!!errors.salesRate}
                        helperText={errors.salesRate?.message}
                      />
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="discountPct"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 1 }}>
                      <LabelText>Discount (%)</LabelText>
                      <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        placeholder="0"
                        margin="none"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        sx={{
                          "& .MuiInputBase-input": { textAlign: "right" },
                        }}
                        error={!!errors.discountPct}
                        helperText={errors.discountPct?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
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
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
              >
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
