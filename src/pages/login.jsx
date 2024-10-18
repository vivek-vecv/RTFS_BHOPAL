import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from './AuthContext.jsx';
import vehicleImage from '../images/transparent.png';
import { CForm, CFormLabel, CFormInput, CButton, CAlert } from '@coreui/react';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const { login, heading } = useAuth();

  return (
    <div className="container-fluid">
      <div
        className="half-height-box shadow-lg mx-auto rounded rounded-5 border-info border"
        style={{
          marginTop: '80px',
          background: `url(${vehicleImage})`,
          backgroundSize: 'contain', // Ensures the image covers the div
          backgroundPosition: 'left',
          backgroundRepeat: 'no-repeat', // Prevents repeating the image
          // height: '50vh', // Adjust height as needed
        }}
      >
        <div className="ms-auto p-4 login-box rounded-end-5  bg-secondary bg-opacity-25 ">
          <h3 className="text-center fw-bold">Login</h3>
          <CForm onSubmit={''} className="p-4 gap-4 d-flex flex-column my-auto">
            <div className="form-group">
              <CFormLabel htmlFor="username" className="fw-bold m-0">
                Username
              </CFormLabel>
              <CFormInput
                type="text"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <CFormLabel htmlFor="password" className="fw-bold m-0">
                Password
              </CFormLabel>
              <CFormInput
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <CButton type="submit" className="btn btn-primary w-100">
              Login
            </CButton>
          </CForm>
          {error && <CAlert color="danger">{error}</CAlert>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
