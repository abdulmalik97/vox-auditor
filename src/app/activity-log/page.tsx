import ActivityLogView from "@/features/app/activity-log";
import { ActivityLogPrivateApi } from "@/features/app/activity-log/api/private";

const ActivityLog = async () => {
  const activityLogEntries = await ActivityLogPrivateApi.getActivityLog() ?? [];

  return <ActivityLogView activityLogEntries={activityLogEntries} />;
};

export default ActivityLog;
