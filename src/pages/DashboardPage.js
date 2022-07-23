
import React, { useEffect } from "react";
import DashboardHeading from "../components/module/dashboard/DashboardHeading";


const DashboardPage = () => {
  useEffect(() => {
    document.title = "Blogging - DashboardPage";
  });
  return (
    <div>
      <DashboardHeading
        title="Dashboard"
        desc="Overview dashboard monitor"
      ></DashboardHeading>
    </div>
  );
};

export default DashboardPage;
