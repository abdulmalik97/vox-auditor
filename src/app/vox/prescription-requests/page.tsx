import PrescriptionRequestsView from "@/features/app/prescription-requests";
import { PrescriptionRequestsPrivateApi } from "@/features/app/prescription-requests/api/private";

const PrescriptionsRequests = async () => {
  const prescriptionRequests = await PrescriptionRequestsPrivateApi.getPrescriptionRequests() ?? [];

  return <PrescriptionRequestsView prescriptionRefillRequests={prescriptionRequests} />;
};

export default PrescriptionsRequests;
