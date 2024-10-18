import { CNavbar, CNavbarBrand } from '@coreui/react';
import logo from '../images/logo1.png';
import { useLocation } from 'react-router-dom';
import { useNavbar } from '../context/NavbarContext.jsx';
import { ShiftAndTime } from './ShiftAndTime.jsx';
import { useEffect } from 'react';

const Navbar = () => {
  const { navbarData, resetNavbarData } = useNavbar();
  const data = {
    pag: { heading: 'Product audit Defect Entry Screen' },
    pdi: { heading: 'PDI Defect Entry Screen' },
    pr: { heading: 'Post Rollout Defect Entry Screen' },
    qg: { heading: 'Quality Gate Defect Entry Screen' },
  };

  const location = useLocation();

  useEffect(() => {
    resetNavbarData();
  }, [location]);

  const pathname = location.pathname;
  const pathAfterSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  return (
    <CNavbar color="primary" className="navbar position-sticky top-0 text-white" style={{ zIndex: '10000' }}>
      <CNavbarBrand>
        <img src={logo} alt="Logo" className="logoImg" style={{ height: '40px' }} />
      </CNavbarBrand>
      <div className="fw-bold text-center ">
        {data[pathAfterSlash]?.heading ? data[pathAfterSlash]?.heading : 'Real Time Feedback System - Bhopal'}{' '}
      </div>
      {((navbarData && pathAfterSlash == 'qg') || (navbarData && pathAfterSlash == 'pr')) && (
        <div className="fw-bold text-center bg-info rounded px-2">
          {navbarData.line == 'POST_ROLLOUT' ? 'Post Rollout' : navbarData.line} {'| '}
          {navbarData.station} {navbarData.direction && '| ' + navbarData.direction}
        </div>
      )}
      <div>
        <span className="fw-bold mx-4">Shift: {<ShiftAndTime />}</span>
      </div>
    </CNavbar>
  );
};

export default Navbar;
