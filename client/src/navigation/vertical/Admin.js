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
    id: "profile",
    title: "Profile",
    icon: <User size={20} />,
    navLink: "/admin/profile",
  },
  {
    id: "Client",
    title: "Clients",
    icon: <Users size={20} />,
    // navLink: "/admin/client",
    children: [
      {
        id: "AddClient",
        title: "Add",
        icon: <Plus size={20} />,
        navLink: "/admin/client/add-client",
      },
      {
        id: "ManageClient",
        title: "Manage",
        icon: <List size={20} />,
        navLink: "/admin/client/manage-client",
      },
    ],
  },
  {
    id: "Employee",
    title: "Employees",
    icon: <Users size={20} />,
    // navLink: "/admin/employee",
    children: [
      {
        id: "AddEmployee",
        title: "Add",
        icon: <Plus size={20} />,
        navLink: "/admin/employee/add-employee",
      },
      {
        id: "ManageEmployee",
        title: "Manage",
        icon: <List size={20} />,
        navLink: "/admin/employee/manage-employee",
      },
    ],
  },
  {
    id: "Case",
    title: "Cases",
    icon: <Archive size={20} />,
    // navLink: "/admin/case",
    children: [
      {
        id: "CreateCase",
        title: "Create",
        icon: <FilePlus size={20} />,
        navLink: "/admin/case/create-case",
      },
      {
        id: "ManageCase",
        title: "Manage",
        icon: <List size={20} />,
        children: [
          {
            id: "Incomplete",
            title: "Incomplete",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/incomplete",
          },
          {
            id: "Assignment",
            title: "Assignment",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/assignment",
          },
          {
            id: "Scheduled",
            title: "Scheduled",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/scheduled",
          },
          {
            id: "Ongoing",
            title: "Ongoing",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/ongoing",
          },
          {
            id: "Completed",
            title: "Completed",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/completed",
          },
          {
            id: "Readdressal",
            title: "Readdressal",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/readdressal",
          },
          {
            id: "Cancelled",
            title: "Cancelled",
            icon: <CornerDownRight size={20} />,
            navLink: "/admin/case/manage-case/cancelled",
          },
        ],
      },
    ],
  },
  {
    id: "LearningModule",
    title: "LMS",
    icon: <Codepen size={20} />,
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: <Home size={20} />,
        navLink: "/admin/lms/dashboard",
      },
      {
        id: "Events",
        title: "Events",
        icon: <Loader size={20} />,
        children: [
          {
            id: "create",
            title: "Create",
            icon: <PlusCircle size={20} />,
            navLink: "/admin/lms/events/create",
          },
          {
            id: "manage",
            title: "Manage",
            icon: <List size={20} />,
            navLink: "/admin/lms/events/manage",
          },
        ],
      },
      {
        id: "workpro",
        title: "Workpro",
        icon: <User size={20} />,
        navLink: "/admin/lms/workpro",
      },
    ],
  },
];
