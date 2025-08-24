import {
  Home,
  Circle,
  PlusCircle,
  Eye,
  Box,
  BarChart,
  FileText,
  List,
  User,
  Save,
  Archive,
  CornerDownRight,
  FilePlus,
  Plus,
  UserCheck,
  Users,
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
    id: "managePatients",
    title: "Manage Patients",
    icon: <Home size={20} />,
    navLink: "/admin/managePatients",
  },
  {
    id: "manageReports",
    title: "Manage Reports",
    icon: <Home size={20} />,
    navLink: "/admin/manageReports",
  },
  {
    id: "doctor",
    title: "Manage Doctor",
    icon: <Home size={20} />,
    navLink: "/admin/doctorManagement",
  },
];
