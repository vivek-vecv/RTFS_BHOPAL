// Navbar.js

import React from 'react';
import { CNavbar, CNavbarBrand, CNavbarText } from '@coreui/react';
import logo from '../images/eicher_logo.png';
import { useLocation } from 'react-router-dom';

const Navbar = ({ heading, currentTime, shift }) => {
  const data = {
    pag: { heading: 'Product audit Defect Entry Screen' },
    pdi: { heading: 'PDI Defect Entry Screen' },
    qg: { heading: 'Quality Gate Defect Entry Screen', zone: ['QG1', 'QG2', 'QG3'] },
  };
  const location = useLocation();
  const pathname = location.pathname;
  const pathAfterSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  return (
    <CNavbar color="primary" className="position-sticky top-0 text-white" style={{ zIndex: '10000' }}>
      <CNavbarBrand>
        <img src={logo} alt="Logo" className="logoImg" style={{ height: '40px' }} />
      </CNavbarBrand>
      <div className="fw-bold text-center ">{data[pathAfterSlash]?.heading}</div>
      <div>
        <CNavbarText className="navText" style={{ marginRight: '20px' }}>
          {currentTime}
        </CNavbarText>
        <span className="fw-bold">Shift: {shift}</span>
      </div>
    </CNavbar>
  );
};

export default Navbar;
