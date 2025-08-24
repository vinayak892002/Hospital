// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// ** Route Components
// ** Default Route

const Dashboard = lazy(() => import("../../views/dashboard/index"));
const MedicineInventory = lazy(() => import("../../views/MedicineInventory/index"));

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
    path: "/inventory",
    element: <MedicineInventory />,
    meta: {
      layout: "adminLayout",
    },
  },
];

export { AdminRoutes };
