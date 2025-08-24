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
    navLink: "/patient/dashboard",
  },

  {
    id: "labReports",
    title: "ViewReports",
    icon: <FileText size={20} />,
    navLink: "patient/ViewReports",
  },
];
