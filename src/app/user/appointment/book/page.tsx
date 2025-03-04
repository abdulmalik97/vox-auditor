import BookAppointmentView from "@/features/app/appointment/book";

// explicit for now until we change the route to use query param
export const dynamic = 'force-dynamic'

const BookAppointment = async () => {
  return <BookAppointmentView />;
};

export default BookAppointment;