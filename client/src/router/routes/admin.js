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
const MedicineInventory = lazy(() =>
  import("../../views/MedicineInventory/index")
);

const Appointment = lazy(() => import("../../views/appointment/index"));
const Department = lazy(() => import("../../views/Department/index"));

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
  {
    path: "/admin/inventory",
    element: <MedicineInventory />,
    meta: {
      layout: "adminLayout",
    },
  },
  {
    path: "/admin/appointment",
    element: <Appointment />,
    meta: {
      layout: "adminLayout",
    },
  },
  {
    path: "/admin/department",
    element: <Department />,
    meta: {
      layout: "adminLayout",
    },
  },
];

export { AdminRoutes };
