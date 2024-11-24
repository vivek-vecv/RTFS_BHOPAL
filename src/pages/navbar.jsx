import { CButton, CNavbar, CNavbarBrand, CTooltip } from '@coreui/react';
import logo from '../images/logo1.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavbar } from '../context/NavbarContext.jsx';
import { ShiftAndTime } from './ShiftAndTime.jsx';
import { FaSignOutAlt } from 'react-icons/fa';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { navbarData, resetNavbarData } = useNavbar();
  const data = {
    pag: { heading: 'Product audit Defect Entry Screen' },
    pdi: { heading: 'PDI Defect Entry Screen' },
    pr: { heading: 'Post Rollout Defect Entry Screen' },
    qg: { heading: 'Quality Gate Defect Entry Screen' },
  };

  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('intendedRoute');
    navigate('/');
  };

  const handleHomePage = () => {
    navigate('/');
  };
  useEffect(() => {
    resetNavbarData();
  }, [location]);

  const pathname = location.pathname;
  const pathAfterSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  return pathAfterSlash != 'dashboard' ? (
    <CNavbar color="primary" className="navbar position-sticky top-0 text-white" style={{ zIndex: '10000' }}>
      <CNavbarBrand onClick={handleHomePage}>
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
      {user && (
        <div>
          <CTooltip
            content={<span className="text-dark">Logout</span>}
            placement="left"
            style={{ zIndex: '17000', '--cui-tooltip-bg': 'var(--cui-white)' }}
          >
            <CButton onClick={handleLogout} color="danger" className="mx-1">
              <FaSignOutAlt color="white" />
              <span className="text-white fw-bold mx-1">{user.username}</span>
            </CButton>
          </CTooltip>
        </div>
      )}
    </CNavbar>
  ) : (
    ''
  );
};

export default Navbar;
