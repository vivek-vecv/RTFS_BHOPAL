import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CAlert,
  CNavbar,
  CNavbarBrand,
  CNavbarText,
} from "@coreui/react";
import logo from "../images/Customer_Logo.png";
import "./login.css";
import {
  login_api,
  headers,
  etbApi,
  testAPi,
  API_URL,
} from "../apis/apipath.jsx";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("sayali");
  const [password, setPassword] = useState("done");
  const [error, setError] = useState("");
  const [res, setRes] = useState("");
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const [shift, setShift] = useState("");
  const { login, heading } = useAuth();
  useEffect(() => {
    axios({
      method: "get",
      url: `http://10.119.1.101:9898/rest/api/login?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`,
      auth: {
        username: "Arun",
        password: "123456",
      },
    })
      .then((response) => {
        console.log(response.data);
        setRes(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const interval = setInterval(() => {
      // console.log("password", headers);
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      axios({
        method: "get",
        url: `http://10.119.1.101:9898/rest/api/login?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
        auth: {
          username: "Arun",
          password: "123456",
        },
      })
        .then((response) => {
          console.log(response.data);
          setRes(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // Check if the login is successful by looking for the specific key in the response
      if (res.Info === "Login successful") {
        login(); // Perform the login action
        const redirectTo = localStorage.getItem("redirectPath");
        localStorage.removeItem("redirectPath");
        localStorage.removeItem("redirectHeading");

        // Redirect to the specified path or default to Dashboard
        navigate(redirectTo || "/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Error in logging, please try again");
      console.log(err);
    }
  };

  return (
    <div className="full-screen">
      <CNavbar color="primary" dark>
        <CNavbarBrand onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="logoImg" />
        </CNavbarBrand>
        <div className="navHeading">
          <CNavbarText className="navText">{heading}</CNavbarText>
        </div>
        <div className="nav2">
          <CNavbarText className="navText">{currentTime}</CNavbarText>
          <br />
          <CNavbarText className="navText">Shift: {shift}</CNavbarText>
        </div>
      </CNavbar>

      <CContainer fluid className="login-container">
        <CRow>
          <CCol md="4" className="login-box">
            <h2>Login</h2>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CForm onSubmit={handleLogin}>
              <div className="form-group">
                <CFormLabel htmlFor="username">User Name </CFormLabel>
                <CFormInput
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <CFormLabel htmlFor="password">Password </CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <CButton type="submit" className="login-button">
                Login
              </CButton>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginPage;
