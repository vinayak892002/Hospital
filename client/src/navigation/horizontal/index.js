import { Mail, Home} from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  // {
  //   id: "add-organiztion",
  //   title: "Add Organization",
  //   icon: <AddOrganization size={20} />,
  //   navLink: "/add-organiztion",
  // },
  {
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
];
