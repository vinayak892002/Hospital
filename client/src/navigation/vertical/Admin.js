import {
  Home,
  Settings,
  UserPlus,
  FileText,
  Users,
  Box,
  Codepen,
  Archive,
} from "react-feather";


const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
const role = userInfo.role || "";

const menuItems = [];

if (role === "Patient") {
  menuItems.push(
    {
      id: "labReports",
      title: "ViewReports",
      icon: <FileText size={20} />,
      navLink: "/patient/ViewReports",
    },
    {
      id: "appointment",
      title: "Appointment",
      icon: <Codepen size={22} />,
      navLink: "/patient/appointment",
    }
  );
} else if (role === "Doctor") {
  menuItems.push({
    id: "manage",
    title: "Manage",
    icon: <Settings size={20} />,
    children: [
      {
        id: "patients",
        title: "Patients",
        icon: <UserPlus size={22} />,
        navLink: "/doctor/managePatients",
      },
      {
        id: "labReports",
        title: "ViewReports",
        icon: <FileText size={20} />,
        navLink: "/doctor/ViewReports",
      },

      {
        id: "appointment",
        title: "Appointment",
        icon: <Codepen size={22} />,
        navLink: "/doctor/appointment",
      },
    ],
  });
} else if (role == "Admin") {
  menuItems.push(
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <Home size={20} />,
      navLink: "/admin/dashboard",
    },
    {
      id: "doctor",
      title: "Doctor",
      icon: <Users size={22} />,
      navLink: "/admin/doctorManagement",
    },
    {
      id: "department",
      title: "Department",
      icon: <Archive size={22} />,
      navLink: "/admin/department",
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: <Box size={22} />,
      navLink: "/admin/inventory",
    }
  );
} else if (role === "LabTechnician") {
  menuItems.push({
    id: "manage",
    title: "Manage",
    icon: <Settings size={20} />,
    children: [
      {
        id: "reports",
        title: "Reports",
        icon: <FileText size={22} />,
        navLink: "/labtech/manageReports",
      },
    ],
  });
} else if (role === "Receptionist") {
  menuItems.push({
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
        id: "appointment",
        title: "Appointment",
        icon: <Codepen size={22} />,
        navLink: "/admin/appointment",
      },
    ],
  });
}
export default menuItems;
