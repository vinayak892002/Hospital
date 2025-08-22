import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronsDown,
  ChevronUp,
  Circle,
  Filter,
  MapPin,
  Plus,
} from "react-feather";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { FaCircle } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
});

const dummyDist = {
  coordinates: {
    latitude: 19.211679,
    longitude: 73.090698,
  },
  time_distance: {
    time: 12,
    distance: 2.4,
  },
};

const statusMap = {
  incomplete: "text-warning",
  partial: "text-warning",
  compete: "text-warning",
  open: "text-warning",
  scheduled: "text-warning",
  ongoing: "text-secondary",
  readdressal: "text-danger",
  completed: "text-success",
  cancelled: "text-danger",
};

const index = () => {
  const navigateTo = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const location = useLocation();
  const userRole = location.pathname.split("/")[1];
  const [caseCard, setCaseCard] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState([
    19.211679, 73.090698,
  ]); // Default position
  const [mapModal, setMapModal] = useState(null);
  const [modalAssigned, setModalAssigned] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);

  useEffect(() => {
    currentLocation();
  }, []);

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // set variables
          setMyLocation({ latitude, longitude });
        },
        (error) => {
          // This will run if the user denies the location access
          toast.error("Geolocation error: " + error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const fetchCaseData = async (urlRole, urlStatus) => {
    const token = localStorage.getItem("piombo-token");

    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `http://localhost:1338/piombo/get-case-data?userData=${token}&urlRole=${urlRole}&urlStatus=${urlStatus}`,
        settings
      );
      const result = await response.json();

      if (response.status == 200) {
        console.log(result);

        setCaseData(result["data"]);
      } else {
        if (result["message"]) {
          toast.error(result["message"]);
          setCaseData(result["message"]);
        }
        if (result["redirect"]) {
          if (result.redirect == "/login") {
            localStorage.removeItem("piombo-token");
            localStorage.removeItem("piombo-user");
          }
          navigateTo(result.redirect);
        }
      }
    } catch (error) {
      toast.error("Internal server error");
      setCaseData("Internal server error");
    }
  };

  useEffect(() => {
    fetchCaseData(userRole);
  }, []);

  return (
    <>
      {caseData == null ? (
        <div className="d-flex justify-content-center align-items-center w-100 fw-bolder fs-4 text-dark">
          <span className="me-2">Fetching Jobs</span>
          <Spinner size="md" className="text-primary" />
        </div>
      ) : typeof caseData == "string" ? (
        <div className="w-100 text-center fw-bolder fs-4">{caseData}</div>
      ) : caseData?.length ? (
        <div className="user-select-none">
          <Card style={{ background: "white" }}>
            <CardHeader>
              <span className="d-flex align-items-center fs-4 fw-bolder text-dark py-1">
                My Cases
              </span>
              <div className="d-flex align-items-center">
                <Button
                  color="primary"
                  size="sm"
                  className="ms-2 d-flex justify-content-center align-items-center border border-1 border-dark"
                  outline={!filterOpen}
                >
                  <Filter className="me-0" size={17} />
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <hr />
                {caseData !== null ? (
                  <>
                    {caseData.map((cse) => (
                      <Col md="4" key={cse.caseId}>
                        <Card
                          className="rounded-lg"
                          style={{
                            border: "1px solid #4b4b4b",
                            background: "white",
                          }}
                        >
                          <CardHeader
                            className="d-flex justify-content-between"
                            onClick={() => {
                              if (caseCard[cse.caseId]) {
                                setCaseCard((prev) => ({
                                  ...prev,
                                  [cse.caseId]: false,
                                }));
                              } else {
                                setCaseCard((prev) => ({
                                  ...prev,
                                  [cse.caseId]: true,
                                }));
                              }
                            }}
                          >
                            <span className="fw-bolder text-secondary fs-5">
                              {cse.caseId}
                              {cse.serviceLocation.siteName ? (
                                <>
                                  <span className="mx-1">-</span>
                                  <span className="fw-bold text-dark fs-5">
                                    {cse.serviceLocation.siteName}
                                  </span>
                                </>
                              ) : (
                                <></>
                              )}
                            </span>
                            {caseCard[cse.caseId] ? (
                              <>
                                <ChevronUp
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setCaseCard((prev) => ({
                                      ...prev,
                                      [cse.caseId]: false,
                                    }));
                                  }}
                                />
                              </>
                            ) : (
                              <ChevronDown
                                className="cursor-pointer"
                                onClick={() => {
                                  setCaseCard((prev) => ({
                                    ...prev,
                                    [cse.caseId]: true,
                                  }));
                                }}
                              />
                            )}
                          </CardHeader>
                          {caseCard[cse.caseId] && (
                            <>
                              <CardBody>
                                <div>
                                  <Label className="form-label fs-5 fw-bold">
                                    Service Type
                                  </Label>
                                  <span className="mx-1">:</span>
                                  {cse.caseData.serviceType}
                                  {cse.caseData.subServiceType &&
                                  cse.caseData.subServiceType !==
                                    cse.caseData.serviceType
                                    ? ` - ${cse.caseData.subServiceType}`
                                    : ""}
                                  <br />
                                  <Label className="form-label fs-5 mt-1 fw-bold">
                                    Application
                                  </Label>
                                  <span className="mx-1">:</span>
                                  {cse.caseData.application}
                                  <br />
                                  <Label className="form-label fs-5 mt-1 fw-bold">
                                    Description
                                  </Label>
                                  <span className="mx-1">:</span>
                                  <br /> {cse.caseData.description}
                                  <br />
                                  {cse.serviceLocation.district ? (
                                    <>
                                      <Label className="form-label fs-5 mt-1 fw-bold">
                                        Location
                                      </Label>
                                      <span className="mx-1">:</span>{" "}
                                      <MapPin
                                        className="text-secondary me-1 cursor-pointer"
                                        style={{
                                          paddingBottom: "2px",
                                          borderBottom: "1px solid #098fb5",
                                          width: "fit-content",
                                        }}
                                        size={17}
                                        onClick={() => {
                                          setInitialPosition([
                                            cse.serviceLocation.latitude,
                                            cse.serviceLocation.longitude,
                                          ]);
                                          setMapModal([
                                            cse.serviceLocation.latitude,
                                            cse.serviceLocation.longitude,
                                          ]);
                                        }}
                                      />{" "}
                                      {cse.serviceLocation.district}{" "}
                                      <span className="me-1">,</span>{" "}
                                      {cse.serviceLocation.state}
                                      <br />
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  <Label className="form-label fs-5 mt-1 fw-bold">
                                    Scheduled For
                                  </Label>
                                  <span className="mx-1">:</span>{" "}
                                  {cse.schedule.date}{" "}
                                  <span className="me-1">,</span>{" "}
                                  {cse.schedule.timeSlot}
                                  <br />
                                  <Label className="form-label fs-5 mt-1 fw-bold">
                                    Assigned Workmen
                                  </Label>
                                  <span className="mx-1">:</span>{" "}
                                  <span
                                    onClick={() => {
                                      if (
                                        Object.keys(cse.workmenInvolved)
                                          .length > 0
                                      ) {
                                        setModalAssigned(true);
                                        setCaseDetails(cse);
                                      } else {
                                        toast.error("No workman assigned");
                                      }
                                    }}
                                    className="text-secondary cursor-pointer"
                                    style={{
                                      paddingBottom: "2px",
                                      borderBottom: "1px solid #098fb5",
                                      width: "fit-content",
                                    }}
                                  >
                                    {cse.workmenInvolved
                                      ? Object.keys(cse.workmenInvolved).length
                                      : 0}
                                  </span>
                                  <br />
                                  <Label className="form-label fs-5 mt-1 fw-bolder">
                                    Distance to Site
                                  </Label>
                                  <span className="mx-1 fw-bolder">
                                    {`: ${dummyDist.time_distance.time} min (${dummyDist.time_distance.distance} km)`}{" "}
                                  </span>{" "}
                                  <br />
                                </div>
                              </CardBody>
                              <CardFooter className="d-flex justify-content-between">
                                <div className={`${statusMap[cse.caseStatus]}`}>
                                  <FaCircle size={12} />
                                  <span
                                    className="fw-bolder"
                                    style={{
                                      margin: "4px",
                                    }}
                                  >
                                    {cse.caseStatus}
                                  </span>
                                </div>
                                <div>
                                  <Link
                                    to={`/${userRole}/my-cases/${cse.caseId}`}
                                    target="_blank"
                                  >
                                    <span
                                      className="text-secondary fw-bolder"
                                      style={{
                                        paddingBottom: "2px",
                                        borderBottom: "2px solid",
                                      }}
                                    >
                                      view more
                                    </span>
                                  </Link>
                                </div>
                              </CardFooter>
                            </>
                          )}
                        </Card>
                      </Col>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </CardBody>
          </Card>

          <Modal
            className="modal-dialog-centered user-select-none"
            isOpen={modalAssigned}
          >
            <ModalHeader
              toggle={() => {
                setModalAssigned(false);
              }}
            >
              View Assigned Workers
            </ModalHeader>
            <ModalBody>
              {caseDetails !== null &&
                Object.keys(caseDetails["workmenInvolved"]).map((wm, ind) => (
                  <Col
                    xs="12"
                    className={`ps-0 ${
                      ind !== 0 ? "mt-1" : ""
                    } form-check d-flex justify-content-start align-items-center`}
                  >
                    <Label className="fs-5 fw-bold m-0 ms-0">
                      {caseDetails["workmenInvolved"][wm]["userName"]}
                    </Label>
                  </Col>
                ))}
            </ModalBody>
          </Modal>

          <Modal className="modal-dialog-centered" isOpen={mapModal !== null}>
            <ModalHeader
              toggle={() => {
                setMapModal(null);
              }}
            >
              Site Location
            </ModalHeader>
            <ModalBody>
              {mapModal !== null && (
                <>
                  <Row
                    className="mt-3 d-flex justify-content-center"
                    style={{
                      height: "400px",
                      width: "100%",
                      margin: "20px 0",
                    }}
                  >
                    <MapContainer
                      center={initialPosition}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[mapModal[0], mapModal[1]]} />
                    </MapContainer>
                  </Row>
                </>
              )}
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <div className="w-100 text-center fw-bolder fs-4">No Cases Found!</div>
      )}
    </>
  );
};

export default index;
