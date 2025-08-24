// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// ** Route Components
// ** Default Route

const Dashboard = lazy(() => import("../../views/dashboard/index"));
const ManageReports = lazy(() =>
  import("../../views/LabReports/components/manageReports")
);
const ManagePatients = lazy(() => import("../../views/managePatients/index"));
const ViewReports = lazy(() =>
  import("../../views/LabReports/components/viewReports")
);
// ** Merge Routes
const AdminRoutes = [
  {
    path: "/patient/dashboard",
    element: <Dashboard />,
    meta: {
      layout: "adminLayout",
    },
  },

  {
    path: "/patient/ViewReports",
    element: <ViewReports />,
    meta: {
      layout: "adminLayout",
    },
  },
];

export { AdminRoutes };
