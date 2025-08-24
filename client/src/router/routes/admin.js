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
const Doctor = lazy(() => import("../../views/doctor/index"));

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
    path: "/admin/manageReports",
    element: <ManageReports />,
    meta: {
      layout: "adminLayout",
    },
  },
  {
    path: "/admin/doctorManagement",
    element: <Doctor />,
    meta: {
      layout: "adminLayout",
    },
  },
];

export { AdminRoutes };
