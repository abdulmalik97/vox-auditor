import Table from "../../components/table";

const ActivityLog = () => {
  const columns = ["Full Name", "Email", "Group"];
  const data = [
    {
      "Full Name": "Danilo Sousa",
      Email: "danilo@example.com",
      Group: "Developer",
    },
    {
      "Full Name": "Zahra Ambessa",
      Email: "zahra@example.com",
      Group: "Admin",
    },
    {
      "Full Name": "Jasper Eriksson",
      Email: "jasper@example.com",
      Group: "Developer",
    },
  ];

  return (
    <div className="m-5 max-w-screen-2xl mx-auto">
    <div className="mx-auto">
      <Table columns={columns} data={data} />
    </div>
  </div>
  );
};

export default ActivityLog;
