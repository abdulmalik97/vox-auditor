export interface AppointmentOutboundCallRequest {
  id: string;
  practiceId: string;
  locationId: string;
  patientFirstName: string;
  patientLastName: string;
  patientPrimaryPhoneNumber: string;
  patientSecondaryPhoneNumber: string;
  patientDob: string;
  status: string;
  providerNameToSchedule: string;
  createdAt: string;
  updatedAt: string;
}
