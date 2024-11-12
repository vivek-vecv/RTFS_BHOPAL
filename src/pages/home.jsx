import { useState, useEffect } from "react";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CFormInput,
  CRow,
  CCol,
  CForm,
  CNav,
  CNavItem,
  CNavLink,
  CNavbarBrand,
  CFormLabel,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilHome,
  cilSettings,
  cilUser,
  cilList,
  cilSearch,
  cilX,
  cilCog,
  cilWarning,
  cilInfo,
  cilPowerStandby,
} from "@coreui/icons";
import "./home.css";
import axios from "axios";
import logo from "../images/eicher_logo.png";
import { serial_number_search, headers } from "../apis/apipath.jsx";
import { useNavigate } from "react-router-dom";
import OperatorModal from "./operatorModel.jsx";
import { useLineStationContext } from "./LineStationContext.jsx";
import { useSerialNumberContext } from "./SerialNumberContext.jsx";
import { useAuth } from "./AuthContext.jsx";

const Home = () => {
  const { lineName, stationName } = useLineStationContext();
  const { serialNumber, setSerialNumber } = useSerialNumberContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shift, setShift] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [model, setModel] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [rolloutCode, setRolloutCode] = useState("");
  const [operator, setOperator] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const hour = currentTime.getHours();
    if (hour >= 8 && hour < 16) {
      setShift("A");
    } else if (hour >= 16 && hour < 24) {
      setShift("B");
    } else {
      setShift("C");
    }

    return () => clearInterval(intervalId);
  }, [currentTime]);

  useEffect(() => {
    console.log("Line Name:", lineName);
    console.log("Station Name:", stationName);
  }, [lineName, stationName]);

  const handleSearchClick = async () => {
    console.log("Search - stationName:", stationName);
    console.log("Search - lineName:", lineName);

    const payload = {
      Serial_Number: serialNumber,
      Line_Name: lineName,
      Station_Name: stationName,
    };

    try {
      const response = await axios.post(serial_number_search, payload, {
        headers,
      });
      console.log("Home API response:", response.data);

      if (response.status === 200) {
        const data = response.data;
        if (
          data &&
          data.Serial_Information &&
          data.Serial_Information.length > 0
        ) {
          setModel(data.Serial_Information[0].Model || "");
          setOrderNumber(data.Serial_Information[0].Order_Number || "");
          setPartDescription(data.Serial_Information[0].Part_Description || "");
          setPartNumber(data.Serial_Information[0].Part_Number || "");
          setRolloutCode(data.Serial_Information[0].RollOutCode || "");
          setSerialNumber(data.Serial_Information[0].Serial_Number || "");
        }
      } else {
        console.error("Failed to fetch serial number");
      }
    } catch (error) {
      console.error(
        "Error fetching serial number:",
        error.response ? error.response.data : error.message || error
      );
    }
  };

  const handleGenealogyClick = () => {
    navigate("/Gen", {
      state: {
        serialNumber,
        stationName,
        operator,
        orderNumber,
        partDescription,
        partNumber,
        model,
        rolloutCode,
      },
    });
  };

  const handleTorqueButtonClick = () => {
    navigate("/torque", {
      state: {
        serialNumber,
        stationName,
        lineName,
        operator,
        orderNumber,
        partDescription,
        partNumber,
        model,
      },
    });
  };

  const handleStationStatusButtonClick = () => {
    navigate("/StationStatus", {
      state: {
        serialNumber,
        operator,
        orderNumber,
        partDescription,
        partNumber,
        model,
      },
    });
  };
  const handleNavClick = (page) => {
    if (page === "Logoff") {
      console.log("Logging off...");
      // Navigate to the login or home page after logoff
      logout();
      navigate("/");
    } else if (page) {
      // Navigate to the specified page
      navigate(`/${page}`);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectOperator = (selectedOperator) => {
    setOperator(selectedOperator);
    closeModal();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const areButtonsEnabled =
    serialNumber &&
    model &&
    orderNumber &&
    partNumber &&
    partDescription &&
    rolloutCode;

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  return (
    <CContainer fluid>
      <CHeader className="header-custom">
        <CHeaderBrand>
          <CNavbarBrand>
            <img src={logo} height="45" alt="Logo" />
            <span className="home-title">QG01 - QUALITY INSPECTION</span>
          </CNavbarBrand>
        </CHeaderBrand>
        <CHeaderNav className="ms-auto header-info">
          <div>
            {currentTime.toLocaleDateString("en-GB")} {formatTime(currentTime)}
          </div>
          <div>Shift: {shift}</div>
          <div className="huserModel" onClick={toggleUserMenu}>
            <CIcon icon={cilUser} size="xl" className="user-icon" />
            {userMenuVisible && (
              <div className="user-menu" onClick={toggleUserMenu}>
                <CIcon icon={cilX} />

                <CListGroup flush>
                  <CIcon
                    icon={cilX}
                    onClick={toggleUserMenu}
                    className="close-icon"
                  />
                  <CListGroupItem className="disabled-menu-item">
                    <CIcon icon={cilCog} className="me-2" />
                    Administration
                  </CListGroupItem>
                  <CListGroupItem className="disabled-menu-item">
                    <CIcon icon={cilWarning} className="me-2" />
                    Warning and Error Log
                  </CListGroupItem>
                  <CListGroupItem onClick={() => handleNavClick("About")}>
                    <CIcon icon={cilInfo} className="me-2" />
                    About
                  </CListGroupItem>
                  <CListGroupItem onClick={() => handleNavClick("Logoff")}>
                    <CIcon icon={cilPowerStandby} className="me-2" />
                    Logoff
                  </CListGroupItem>
                </CListGroup>
              </div>
            )}
          </div>
        </CHeaderNav>
      </CHeader>

      <CForm>
        <CRow className="my-4">
          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="serialNumber">
              Serial Number
            </CFormLabel>
            <div
              className="search-box"
              onClick={() => {
                if (!operator) {
                  alert("Select Operator");
                }
              }}
            >
              <CFormInput
                id="serialNumber"
                type="text"
                placeholder="Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="search-input"
                disabled={!operator}
              />
              <div className="searchIconBtn">
                <CIcon icon={cilSearch} onClick={handleSearchClick} />
              </div>
            </div>
          </CCol>

          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="orderNumber">
              Order Number
            </CFormLabel>
            <CFormInput
              id="orderNumber"
              type="text"
              placeholder="Order Number"
              value={orderNumber}
              disabled
            />
          </CCol>
          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="model">
              Model
            </CFormLabel>
            <CFormInput
              id="model"
              type="text"
              placeholder="Model"
              value={model}
              disabled
            />
          </CCol>
          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="partNumber">
              Part Number
            </CFormLabel>
            <CFormInput
              id="partNumber"
              type="text"
              placeholder="Part Number"
              value={partNumber}
              disabled
            />
          </CCol>
          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="partDescription">
              Part Description
            </CFormLabel>
            <CFormInput
              id="partDescription"
              type="text"
              placeholder="Part Description"
              value={partDescription}
              disabled
            />
          </CCol>
          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="rolloutCode">
              Rollout Code
            </CFormLabel>
            <CFormInput
              id="rolloutCode"
              type="text"
              placeholder="Rollout Code"
              value={rolloutCode}
              disabled
            />
          </CCol>
          <CCol xs={12} sm={12} md={6} lg={2}>
            <CFormLabel className="hlabel" htmlFor="operator">
              Operator
            </CFormLabel>
            <CFormInput
              id="operator"
              type="text"
              placeholder="Operator"
              value={operator}
              disabled
            />
          </CCol>
        </CRow>
      </CForm>

      <div className="nav-bottom">
        <CNav variant="pills" className="hicon justify-content-around">
          <CNavItem>
            <CNavLink href="#" onClick={handleGenealogyClick}>
              <button className="hbutton" disabled={!areButtonsEnabled}>
                <CIcon icon={cilHome} /> Genealogy
              </button>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <button className="hbutton" disabled={!areButtonsEnabled}>
                <CIcon icon={cilSettings} /> Checkpoint
              </button>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={handleTorqueButtonClick}>
              <button className="hbutton" disabled={!areButtonsEnabled}>
                <CIcon icon={cilSettings} /> Torque
              </button>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <button className="hbutton" disabled={!areButtonsEnabled}>
                <CIcon icon={cilSettings} /> Rollout
              </button>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <button className="hbutton" disabled={!areButtonsEnabled}>
                <CIcon icon={cilSettings} /> Send To
              </button>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#" onClick={handleStationStatusButtonClick}>
              <button className="hbutton" disabled={!areButtonsEnabled}>
                <CIcon icon={cilSettings} /> Station Status & Process Data
              </button>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <button className="hbutton" onClick={openModal}>
                <CIcon icon={cilList} /> Operator Login
              </button>
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>

      <OperatorModal
        visible={modalVisible}
        onSelectOperator={selectOperator}
        onClose={closeModal}
        stationName={stationName}
      />
    </CContainer>
  );
};

export default Home;
