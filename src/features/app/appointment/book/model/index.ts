export interface Provider {
  providerFirstName: string;
  providerLastName: string;
  providerSpeciality: string;
  providerIds: string[];
}

export interface Providers {
  [actorId: string]: Provider;
}

export interface Schedule {
  [locationId: string]: {
    locationName: string;
    locationAddress: string;
    availability: Availability;
  };
}

export interface Availability {
  [date: string]: {
    dateInYYYYMMDD: string;
    formattedTimes: string[];
  };
}

export interface BookAppointmentPayload {
  // Required fields when booking an appointment
  appointmentDateTime: string;
  patientFirstName: string;
  patientLastName: string;
  patientBirthdate: string;
  patientPhoneNumber: string;
  providerId: string;

  // Add customer fields here
}
export type PartialBookAppointmentPayload = Partial<BookAppointmentPayload>;
