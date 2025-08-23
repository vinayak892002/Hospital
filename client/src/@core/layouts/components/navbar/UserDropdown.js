// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

import toast from "react-hot-toast";

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";
import { FaIdCard } from "react-icons/fa";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { useEffect, useState } from "react";

const getRoleName = (roleCode) => {
  const roleMap = {
    ADM: "Admin",
  };

  return roleMap[roleCode] || "Unknown";
};

const reverseUrlRoleMap = {
  ADM: "admin",
};

const UserDropdown = () => {
  const navigateTo = useNavigate();
  const [idModal, setIdModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const logout = async () => {
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const fetchResponse = await fetch(
      `http://localhost:1333/piombo/logout`,
      settings
    );
    const res = await fetchResponse.json();
    if (fetchResponse.status === 200) {
      toast.success(res.message);
      localStorage.removeItem("piombo-worker-token");
      localStorage.removeItem("piombo-worker");
    } else {
      toast.error(res.message);
    }
    navigateTo("/login");
  };

  const validateUser = async () => {
    const sessData = localStorage.getItem("piombo-worker-token");

    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const fetchResponse = await fetch(
      `http://localhost:1338/piombo/validate-user?sessData=${sessData}`,
      settings
    );
    const res = await fetchResponse.json();

    if (fetchResponse.status == 200) {
      console.log("hello", res["user"]);
      setUserDetails(res["user"]);
    } else {
      console.log("sdsdsfsfsf");
      toast.error(res["message"]);
      localStorage.removeItem("piombo-worker-token");
      localStorage.removeItem("piombo-worker");
      navigateTo(res["redirect"]);
    }
  };

  useEffect(() => {
    validateUser();
    // const userData = localStorage.getItem("piombo-user");
    // if (userData) {
    //   const user = JSON.parse(userData);
    //   if ("userId" in user && "role" in user) {
    //     setUserDetails(user);
    //   } else navigateTo("/login");
    // } else {
    //   navigateTo("/login");
    // }
  }, []);

  const profileUrl = `/${reverseUrlRoleMap[userDetails.role]}/profile`;

  return (
    <>
      {userDetails["userId"] ? (
        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle
            href="/"
            tag="a"
            className="nav-link dropdown-user-link"
            onClick={(e) => e.preventDefault()}
          >
            <div className="user-nav d-sm-flex d-none">
              <span className="user-name fw-bold">{userDetails["userId"]}</span>
              <span className="user-status">
                {getRoleName(userDetails["role"])}
              </span>
            </div>

            {/* <Avatar
          img={User}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />   */}
            <div
              // className="avatar-icon-wrapper"
              className="d-flex justify-content-center align-items-center rounded-circle "
              style={{
                height: "40px",
                width: "40px",
                backgroundColor: "#f0f0f0",
                // overflow: 'hidden',
              }}
            >
              <User size={25} />
            </div>
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem tag={Link} to={profileUrl}>
              <User size={14} className="me-75" />
              <span className="align-middle">Profile</span>
            </DropdownItem>

            {userDetails["role"] === "ADM" ||
            userDetails["role"] === "WIN" ||
            userDetails["role"] === "WFM" ? (
              <>
                <DropdownItem
                  className="w-100"
                  onClick={() => setIdModal(true)}
                >
                  <FaIdCard size={14} className="me-75" />
                  <span className="align-middle">My I'd</span>
                </DropdownItem>
              </>
            ) : (
              <></>
            )}

            {/* <DropdownItem divider /> */}
            <DropdownItem
              // tag={Link}
              className="w-100"
              onClick={() => {
                logout();
              }}
            >
              <Power size={14} className="me-75" />
              <span className="align-middle">Logout</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ) : (
        <></>
      )}

      <Modal className="modal-dialog-centered" isOpen={idModal === true}>
        <ModalHeader toggle={() => setIdModal(false)}>
          <div>
            <span className="text-dark">My I'd</span>
          </div>
        </ModalHeader>
        <ModalBody className="user-select-none w-100 d-flex justify-content-center my-1"></ModalBody>
      </Modal>
    </>
  );
};

export default UserDropdown;
