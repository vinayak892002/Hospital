import {
  Home,
  Circle,
  PlusCircle,
  Eye,
  Box,
  BarChart,
  FileText,
  Settings,
  List,
  User,
  Save,
  Archive,
  CornerDownRight,
  FilePlus,
  Plus,
  UserCheck,
  Users,
  UserPlus,
  Codepen,
  Loader,
} from "react-feather";

export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/admin/dashboard",
  },
  {
    id: "manage",
    title: "Manage",
    icon: <Settings size={20} />,
    children: [
      {
        id: "patients",
        title: "Patients",
        icon: <UserPlus size={22} />,
        navLink: "/admin/managePatients",
      },
      {
        id: "reports",
        title: "Reports",
        icon: <FileText size={22} />,
        navLink: "/admin/manageReports",
      },
      {
        id: "doctor",
        title: "Doctor",
        icon: <Users size={22} />,
        navLink: "/admin/doctorManagement",
      },
      {
        id: "inventory",
        title: "Inventory",
        icon: <Box size={20} />,
        navLink: "/admin/inventory",
      },
    ],
  },
];
