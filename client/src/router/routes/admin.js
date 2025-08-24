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
const LabReports = lazy(() =>
  import("../../views/LabReports/components/viewReports")
);
// ** Merge Routes
const AdminRoutes = [
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
    meta: {
      layout: "adminLayout",
    },
  },
  {
    path: "/admin/managePatients",

    element: <ManagePatients />,
    meta: {
      layout: "vertical",
    },
  },
  {
    path: "/admin/manage",
    element: <ManageReports />,
    meta: {
      layout: "adminLayout",
    },
  },
  {
    path: "/admin/LabReports",
    element: <LabReports />,
    meta: {
      layout: "adminLayout",
    },
  },
];

export { AdminRoutes };
