export interface CancelledAppointment {
  id?: string;
  appointmentId?: string;
  appointment_datetime?: string;
  first_name?: string;
  last_name?: string;
  primary_phone_number?: string;
  provider_first_name?: string;
  provider_last_name?: string;
  provider_id?: string | null;
  appointment_type?: string;
  reason_for_visit?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CancelledAppointmentsResponse {
  cancelledAppointments: CancelledAppointment[];
}
