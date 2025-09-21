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
// import defaultIcon from "../../assets/images/default-img.png";

const schema = yup.object().shape({
  itemName: yup.string().required("Item name is required"),
  description: yup.string().required("Description is required"),
  saleRate: yup
    .number()
    .typeError("Sale rate must be a number")
    .required("Sale rate is required"),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .required("Discount is required"),
  image: yup.mixed().required("Image is required"),
});

export default function NewItemModal({ open, handleClose }) {
  const [imageName, setImageName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    clearErrors
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      itemName: "",
      description: "",
      saleRate: "",
      discount: "",
      image: null,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        itemName: "",
        description: "",
        saleRate: "",
        discount: "",
        image: null,
      });
    }
  }, [open, reset]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "40px",
      "& input": {
        padding: "8px 12px",
        // "&::placeholder": {
        //   fontSize: "0.9 rem",
        // },
      },
    },
  });
  const LabelText = styled(Typography)({
    display: "block",
    marginBottom: 0,
    fontWeight: "bold",
    fontSize: "0.85rem",
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%", 
            sm: 600, 
          },
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
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            New Item
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Image Upload */}
        <Controller
  name="image"
  control={control}
  render={({ field }) => (
    <Box my={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <label htmlFor="upload-input">
          <Image
            src={previewUrl || "/images/default-img.png"}
            alt="My Image"
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
              // check size (5MB = 5 * 1024 * 1024)
              if (file.size > 5 * 1024 * 1024) {
                setError("image", {
                  type: "manual",
                  message: "File size should not exceed 5MB",
                });
                return;
              } else {
                clearErrors("image");
              }

              setValue("image", file);
              setImageName(file.name);
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
        />

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
          <Typography variant="body2">PNG or JPG, max 5MB</Typography>
        </Box>
      </Box>

      {errors.image && (
        <Typography color="error" variant="body2" mt={1}>
          {errors.image.message}
        </Typography>
      )}
    </Box>
  )}
/>


          {/* Item Name */}
          <Controller
            name="itemName"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 1 }}>
                <LabelText variant="subtitle1" component={"span"}>
                  Item Name
                </LabelText>
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

       <Controller
  name="description"
  control={control}
  render={({ field }) => {
    const currentLength = field.value?.length || 0;
    const maxLength = 5000;

    return (
      <Box sx={{ mb: 1 }}>
        <LabelText variant="subtitle1" component={"span"}>
          Description*
        </LabelText>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 0.5,
          }}
        >
          <span style={{ fontSize: "12px", color: currentLength > maxLength ? "red" : "gray" }}>
            {currentLength}/{maxLength}
          </span>
        </Box>
      </Box>
    );
  }}
/>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="saleRate"
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 1 }}>
                    <LabelText variant="subtitle1" component="span">
                      Sale Rate*
                    </LabelText>
                    <CustomTextField
                      {...field}
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input::placeholder": {
                          textAlign: "right",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "right",
                        },
                      }}
                      placeholder="0.00"
                      margin="none"
                      error={!!errors.saleRate}
                      helperText={errors.saleRate?.message}
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 1 }}>
                    <LabelText variant="subtitle1" component="span">
                      Discount (%)
                    </LabelText>
                    <CustomTextField
                      {...field}
                      fullWidth
                      placeholder="0"
                      margin="none"
                      sx={{
                        "& .MuiInputBase-input::placeholder": {
                          textAlign: "right",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "right",
                        },
                      }}
                      error={!!errors.discount}
                      helperText={errors.discount?.message}
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
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
