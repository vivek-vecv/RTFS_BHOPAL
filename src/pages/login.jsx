import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { credentials } from './credentials.jsx';
import { CContainer, CRow, CCol, CForm, CFormLabel, CFormInput, CImage, CButton, CAlert } from '@coreui/react';
import Navbar from './navbar.jsx';
import { login_api, headers, etbApi, testAPi, API_URL } from '../apis/apipath.jsx';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [res, setRes] = useState('');
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [shift, setShift] = useState('');
  const { login, heading } = useAuth();
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      const formattedTime = `${now.toLocaleDateString()} ${adjustedHours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')} ${ampm}`;
      const shift = hours < 12 ? 'A' : hours < 18 ? 'B' : 'C';
      setCurrentTime(formattedTime);
      setShift(shift);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    const user = credentials.find((cred) => cred.username === username && cred.password === password);

    console.log(username, password);

    if (user) {
      console.log(user);
      login(user);
      // Optionally, redirect to a default route or the user's component
      window.location.hash = `/${username.toLowerCase()}`; // Redirect based on username
    } else {
      setError('Username and password are incorrect');
    }
  };

  return (
    <>
      <Navbar shift={shift} currentTime={currentTime} heading={heading} />
      <CContainer fluid className="d-flex justify-content-center align-items-center">
        <CRow className=" d-flex justify-content-center align-items-center bg-gradient rounded-2">
          <CCol xs={12} md={6} className="d-flex justify-content-center">
            <CImage
              fluid
              src="/src/images/transparent.png"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </CCol>

          <CCol xs={12} md={6} className="border border-2 shadow bg-light rounded p-4 w-auto">
            <h2 style={{ textAlign: 'center' }}>Login</h2>

            {error && <CAlert color="danger">{error}</CAlert>}

            <CForm onSubmit={handleLogin} className="p-4 gap-4 d-flex flex-column">
              <div className="form-group">
                <CFormLabel htmlFor="username">Username</CFormLabel>
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
                <CFormLabel htmlFor="password">Password</CFormLabel>
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

              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default LoginPage;
