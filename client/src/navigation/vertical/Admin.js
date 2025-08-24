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
    title: "ManagePatients",
    icon: <Home size={20} />,
    navLink: "/admin/managePatients",
  },
  {
    id: "list",
    title: "LIST",
    icon: <Home size={20} />,
    navLink: "/admin/manage",
  },
  {
    id: "labReports",
    title: "Lab Reports",
    icon: <FileText size={20} />,
    navLink: "admin/LabReports",
  },
];
