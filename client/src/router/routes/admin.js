// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// ** Route Components
// ** Default Route

const Dashboard = lazy(() => import("../../views/dashboard/index"));

// ** Merge Routes
const AdminRoutes = [
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
    meta: {
      layout: "adminLayout",
    },
  },
];

export { AdminRoutes };
