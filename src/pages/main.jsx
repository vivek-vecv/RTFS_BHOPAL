import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import {
  CNavbar,
  CNavbarBrand,
  CNavbarToggler,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CCollapse,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@coreui/coreui/dist/css/coreui.min.css";
import "./main.css";
import backgroundImageGif from "../images/homepage_slides.gif";
import logo from "../images/Customer_Logo.png";

const MainPage = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { setHeading } = useAuth();
  const { isLoggedIn, logout } = useAuth();

  const toggleNavbar = () => setVisible(!visible);

  const handleNavClick = (path, heading) => {
    setHeading(heading);
    if (isLoggedIn) {
      navigate(path);
    } else {
      // Set the intended destination in local storage
      localStorage.setItem("redirectPath", path);
      localStorage.setItem("redirectHeading", heading);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="main-container">
      <CNavbar colorScheme="dark" className="bg-primary">
        <CNavbarBrand href="#">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </CNavbarBrand>
        <CNavbarToggler onClick={toggleNavbar} className="navbarToggler">
          <CIcon icon={cilMenu} size="lg" className="hamburgerIcon " />
        </CNavbarToggler>
        <CCollapse
          visible={visible}
          className={`dropdown-menu ${visible ? "show" : ""}`}
        >
          <CNavbarNav>
            <CNavItem>
              <CNavLink href="#" onClick={() => handleNavClick("")}>
                Production Execution
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#" onClick={() => handleNavClick("")}>
                Administration
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#" onClick={() => handleNavClick("")}>
                Warning and Error Log
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#" onClick={() => handleNavClick("")}>
                About
              </CNavLink>
            </CNavItem>
            {/* <CNavItem>
              <CNavLink href="#" onClick={() => handleNavClick('/login',' ')}>Login</CNavLink>
            </CNavItem>*/}
            <CNavItem>
              {isLoggedIn ? (
                <CNavLink href="#" onClick={handleLogout}>
                  Logout
                </CNavLink>
              ) : (
                <CNavLink href="#" onClick={() => handleNavClick("/", "")}>
                  Login
                </CNavLink>
              )}
            </CNavItem>
          </CNavbarNav>
        </CCollapse>
      </CNavbar>

      <div
        className="background-container"
        style={{ backgroundImage: `url(${backgroundImageGif})` }}
      ></div>
      <div className="button-container">
        <button
          className="btn btn-primary"
          onClick={() => handleNavClick("/dashboard", "VIN Traceability")}
        >
          VIN Traceability
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleNavClick("/dashboard", "Audit")}
        >
          Audit
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleNavClick("/dashboard", "Audit Report")}
        >
          Audit Report
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleNavClick("/dashboard", "Post Rollout")}
        >
          POST ROLLOUT
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleNavClick("/dashboard", "QUALITY(TABLET)")}
        >
          Quality(Tablet)
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleNavClick("/dashboard", "REWORK(TABLET)")}
        >
          Rework(Tablet)
        </button>
      </div>
    </div>
  );
};

export default MainPage;
