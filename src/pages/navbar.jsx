// Navbar.js

import React from "react";
import { CNavbar, CNavbarBrand, CNavbarText } from "@coreui/react";
import logo from "../images/eicher_logo.png";
import "./navbar.css";

const Navbar = ({ heading, currentTime, shift }) => {
  return (
    <CNavbar color="primary">
      <CNavbarBrand>
        <img
          src={logo}
          alt="Logo"
          className="logoImg"
          style={{ height: "40px" }}
        />
      </CNavbarBrand>
      <div style={{ flex: 1, textAlign: "center" }}>
        <CNavbarText className="navText">{heading}</CNavbarText>
      </div>
      <div>
        <CNavbarText className="navText" style={{ marginRight: "20px" }}>
          {currentTime}
        </CNavbarText>
        <CNavbarText className="navText">Shift: {shift}</CNavbarText>
      </div>
    </CNavbar>
  );
};

export default Navbar;
