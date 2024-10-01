import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CButton,
  CNavbar,
  CNavbarBrand,
  CNavbarText,
} from "@coreui/react";
import logo from "../images/Customer_Logo.png";
import { Route_Selection, step_selection, headers } from "../apis/apipath.jsx";
import "./dash.css";
import { useLineStationContext } from "./LineStationContext.jsx";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { setLineName, setStationName } = useLineStationContext();
  const [currentTime, setCurrentTime] = useState("");
  const [shift, setShift] = useState("");
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState("");
  const [routeSteps, setRouteSteps] = useState([]);
  const [routeStep, setRouteStep] = useState("");
  const [stationSide, setStationSide] = useState("");
  const [routeStepDisabled, setRouteStepDisabled] = useState(false);
  const [stationSideDisabled, setStationSideDisabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12;
      const formattedTime = `${now.toLocaleDateString()} ${adjustedHours}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
      const shift = hours < 12 ? "A" : hours < 18 ? "B" : "C";
      setCurrentTime(formattedTime);
      setShift(shift);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(
          `http://10.119.1.101:9898/rest/api/getAllRouteNames`,
          {
            auth: {
              username: "Arun",
              password: "123456",
            },
          }
        );
        const jsonMeData = JSON.parse(response);
        console.log(
          "------------------response-------------------\n",
          jsonMeData,
          typeof response
        );

        const routeNames = response.data.Route_Information.map(
          (route) => route.Route_Name
        );
        setRoutes(routeNames);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const fetchSteps = async (routeNames) => {
    try {
      setStationSideDisabled(true);
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getStepsByRouteName`,
        { Route_Name: routeNames },
        {
          auth: {
            username: "Arun",
            password: "123456",
          },
        }
      );
      console.log("Dashboard Steps Api:", response.data);

      if (response.data.Step_Information) {
        const steps = response.data.Step_Information.map(
          (step) => step.Step_Name
        );
        setRouteSteps(steps);
        setRouteStepDisabled(false);
      } else {
        console.warn("No steps returned for the selected route.");
        setRouteSteps([]);
        setRouteStepDisabled(false);
      }
    } catch (error) {
      console.error("Error fetching steps:", error);
      setRouteStepDisabled(false);
    }
  };

  const handleRouteChange = (event) => {
    const selectedRoute = event.target.value;
    setRoute(selectedRoute);
    setRouteStep("");
    setStationSide("");
    setStationSideDisabled(true);
    setRouteStepDisabled(true);

    if (selectedRoute) {
      fetchSteps(selectedRoute);
    }
  };

  const handleRouteStepChange = (event) => {
    setRouteStep(event.target.value);
    setStationSideDisabled(false);
  };

  const handleStationSideChange = (event) => {
    setStationSide(event.target.value);
  };

  const handleOkClick = () => {
    if (route && routeStep) {
      setLineName(route); // Set line name in context
      setStationName(routeStep); // Set station name in context
      navigate("/home"); // Navigate to Home page
    } else {
      alert("Please select a route and step.");
    }
  };

  return (
    <div className="full-screen">
      <div className="nav1">
        <CNavbar className="navbar1 " color="primary" dark>
          <CNavbarBrand onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="logoImg" />
          </CNavbarBrand>
          <div className="navHeading">
            <CNavbarText className="navText"> </CNavbarText>
          </div>
          <div className="nav2">
            <CNavbarText className="navText">{currentTime}</CNavbarText>
            <br />
            <CNavbarText className="navText">Shift: {shift}</CNavbarText>
          </div>
        </CNavbar>
      </div>
      <CRow className="header mb-3">
        <CCol xs={12} md={4} className="header-item">
          <CFormLabel>Route Selection</CFormLabel>
          <CFormSelect
            value={route}
            onChange={handleRouteChange}
            className="mb-3"
          >
            <option value="">Select Route</option>
            {routes.map((route, index) => (
              <option key={index} value={route}>
                {route}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={4} className="header-item">
          <CFormLabel>Step Selection</CFormLabel>
          <CFormSelect
            value={routeStep}
            onChange={handleRouteStepChange}
            disabled={routeStepDisabled}
            className="mb-3"
          >
            <option value="">Select Route Step</option>
            {routeSteps.map((step, index) => (
              <option key={index} value={step}>
                {step}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={4} className="header-item">
          <CFormLabel>Side Selection</CFormLabel>
          <CFormSelect
            value={stationSide}
            onChange={handleStationSideChange}
            disabled={stationSideDisabled}
            className="mb-3"
          >
            <option value="">Select Station Side</option>
            <option value="side1">Left</option>
            <option value="side2">Right</option>
            <option value="side3">No Side</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CRow className="btn-container">
        <CCol xs={12} md={2} className="header-item">
          <CButton color="primary" onClick={handleOkClick} className="btn">
            OK
          </CButton>
        </CCol>
      </CRow>
    </div>
  );
};

export default DashboardPage;
