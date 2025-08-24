import {
  Home,
  Circle,
  Calendar,
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
  Briefcase
} from "react-feather";

export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/admin/dashboard",
  },
  {
    id: "appointment",
    title: "Appointment",
    icon: <Calendar size={20} />,
    navLink: "/admin/appointment",
  },
  {
    id: "department",
    title: "Department",
    icon: <Briefcase size={20} />,
    navLink: "/admin/department",
  },
];
