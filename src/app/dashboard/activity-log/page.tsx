// explicit for now until we change the route to use query param
export const dynamic = "force-dynamic";

import ActivityLogView from "@/features/app/activity-log";

const ActivityLog = async () => {
  return <ActivityLogView />;
};

export default ActivityLog;
