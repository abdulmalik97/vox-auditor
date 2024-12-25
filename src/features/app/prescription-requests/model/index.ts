export interface PrescriptionRefillRequest {
  id: string
  practiceId: string;
  locationId: string;
  prescriptionName: string;
  patientFirstName: string;
  patientLastName: string;
  patientDob: string;
  patientPhoneNumber: string;
  status: string;
}

  