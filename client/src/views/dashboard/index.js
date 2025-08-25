import React from "react";
import { ReportsDashboard } from "./ReportsDashboard";
import Logout from "../logout";

const index = () => {
  return (
    <>
      <Logout />
      <ReportsDashboard />
    </>
  );
};

export default index;
