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

// Get user info from localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
const role = userInfo.role || "";

const menuItems = [];

if (role === "Patient") {
  // Only show ViewReports for patients
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
} else {
  // Show full admin menu for others
  menuItems.push(
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
          icon: <Box size={22} />,
          navLink: "/admin/inventory",
        },
        {
          id: "appointment",
          title: "Appointment",
          icon: <Codepen size={22} />,
          navLink: "/admin/appointment",
        },
        {
          id: "department",
          title: "Department",
          icon: <Archive size={22} />,
          navLink: "/admin/department",
        },
      ],
    }
  );
}

export default menuItems;
