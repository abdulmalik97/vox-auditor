import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Account } from "@/contexts/account/context";

interface OutreachModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OutreachFormData) => Promise<void>;
  locations: Account["practice"]["locations"];
  providers: Array<{ id: string; name: string }>;
}

interface OutreachFormData {
  patientFirstName: string;
  patientLastName: string;
  patientPrimaryPhoneNumber: string;
  patientSecondaryPhoneNumber: string;
  patientDob: string;
  providerNameToSchedule: string;
  submit?: string;
  locationId: string;
}

const OutreachModal: React.FC<OutreachModalProps> = ({
  open,
  onClose,
  onSubmit,
  locations,
  providers,
}) => {
  const [formData, setFormData] = useState<OutreachFormData>({
    patientFirstName: "",
    patientLastName: "",
    patientPrimaryPhoneNumber: "",
    patientSecondaryPhoneNumber: "",
    patientDob: "",
    providerNameToSchedule: "",
    locationId: "",
  });

  const [errors, setErrors] = useState<Partial<OutreachFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof OutreachFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<OutreachFormData> = {};

    if (!formData.patientFirstName.trim()) {
      newErrors.patientFirstName = "First name is required";
    }

    if (!formData.patientLastName.trim()) {
      newErrors.patientLastName = "Last name is required";
    }

    if (!formData.patientPrimaryPhoneNumber.trim()) {
      newErrors.patientPrimaryPhoneNumber = "Primary phone number is required";
    } else if (!formData.patientPrimaryPhoneNumber.match(/^\+1\d{10}$/)) {
      newErrors.patientPrimaryPhoneNumber =
        "Please enter a valid phone number with country code";
    }

    if (
      formData.patientSecondaryPhoneNumber.trim() &&
      !formData.patientSecondaryPhoneNumber.match(/^\+1\d{10}$/)
    ) {
      newErrors.patientSecondaryPhoneNumber =
        "Please enter a valid phone number with country code";
    }

    if (!formData.patientDob) {
      newErrors.patientDob = "Date of birth is required";
    } else if (selectedDate && !selectedDate.isValid()) {
      newErrors.patientDob = "Please enter a valid date";
    }

    if (!formData.providerNameToSchedule.trim()) {
      newErrors.providerNameToSchedule = "Provider name is required";
    }

    if (!formData.locationId) {
      newErrors.locationId = "Facility is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        patientFirstName: "",
        patientLastName: "",
        patientPrimaryPhoneNumber: "",
        patientSecondaryPhoneNumber: "",
        patientDob: "",
        providerNameToSchedule: "",
        locationId: "",
      });
      setSelectedDate(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally show error message to user
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isSubmitting) {
      handleSubmit();
    }
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      patientFirstName: "",
      patientLastName: "",
      patientPrimaryPhoneNumber: "",
      patientSecondaryPhoneNumber: "",
      patientDob: "",
      providerNameToSchedule: "",
      locationId: "",
    });
    setSelectedDate(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="outreach-modal-title"
      aria-describedby="outreach-modal-description"
    >
      <Box sx={style}>
        <DialogTitle
          id="outreach-modal-title"
          sx={{
            pb: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          Patient Outreach Information
        </DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3} sx={{ mt: -1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="patientFirstName"
                  label="Patient First Name"
                  value={formData.patientFirstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  error={!!errors.patientFirstName}
                  helperText={errors.patientFirstName}
                  fullWidth
                  required
                  autoFocus
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="patientLastName"
                  label="Patient Last Name"
                  value={formData.patientLastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  error={!!errors.patientLastName}
                  helperText={errors.patientLastName}
                  fullWidth
                  required
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="patientPrimaryPhoneNumber"
                  label="Primary Phone Number"
                  value={formData.patientPrimaryPhoneNumber}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  error={!!errors.patientPrimaryPhoneNumber}
                  helperText={errors.patientPrimaryPhoneNumber}
                  fullWidth
                  required
                  size="medium"
                  type="tel"
                  placeholder="+1XXXXXXXXXX"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="patientSecondaryPhoneNumber"
                  label="Secondary Phone Number"
                  value={formData.patientSecondaryPhoneNumber}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  error={!!errors.patientSecondaryPhoneNumber}
                  helperText={errors.patientSecondaryPhoneNumber}
                  fullWidth
                  size="medium"
                  type="tel"
                  placeholder="+1XXXXXXXXXX"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date of Birth"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    if (newValue) {
                      // Convert Dayjs to format string
                      const formattedDate = newValue.format("YYYY-MM-DD");
                      setFormData((prev) => ({
                        ...prev,
                        patientDob: formattedDate,
                      }));
                      // Clear error when valid date is selected
                      if (errors.patientDob) {
                        setErrors((prev) => ({
                          ...prev,
                          patientDob: undefined,
                        }));
                      }
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.patientDob,
                      helperText: errors.patientDob,
                      size: "medium",
                      InputLabelProps: {
                        shrink: true,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="providerNameToSchedule"
                  label="Provider Name"
                  value={formData.providerNameToSchedule}
                  onChange={handleChange}
                  error={!!errors.providerNameToSchedule}
                  helperText={errors.providerNameToSchedule}
                  fullWidth
                  required
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.name}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="locationId"
                  label="Facility"
                  value={formData.locationId}
                  onChange={handleChange}
                  error={!!errors.locationId}
                  helperText={errors.locationId}
                  fullWidth
                  required
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {Object.entries(locations).map(([locationId, location]) => (
                    <MenuItem key={locationId} value={locationId}>
                      {location.facilityName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </LocalizationProvider>
          {errors.submit && (
            <FormHelperText error sx={{ mt: 2, textAlign: "center" }}>
              {errors.submit}
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              minWidth: 100,
              mr: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{
              minWidth: 100,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  width: 800,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
};

export default OutreachModal;
