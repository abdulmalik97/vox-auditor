import React, { Suspense } from "react";
import SearchAppointmentsView from "@/features/app/search-appointments";

const SearchAppointmentsPage = () => {
  return (
    <Suspense fallback={null}>
      <SearchAppointmentsView />
    </Suspense>
  );
};

export default SearchAppointmentsPage;
