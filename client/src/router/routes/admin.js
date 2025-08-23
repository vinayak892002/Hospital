// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// ** Route Components
// ** Default Route

const Dashboard = lazy(() => import("../../views/dashboard/index"));

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
    path: "/admin/login",
    element: <Doctor />,
    meta: {
      layout: "adminLayout",
    },
  },
    {
    path: "/admin/doctor",
    element: <Doctor/>,
    meta: {
      layout: "adminLayout",
    },
    
  },

];

export { AdminRoutes };
