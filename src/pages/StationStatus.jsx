import React, { useEffect, useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
} from "@coreui/react";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./StationStatus.css";
import { useNavigate } from "react-router-dom";
import { Process_data_button_click, headers } from "../apis/apipath.jsx";

import { useLineStationContext } from "./LineStationContext.jsx";

const StationStatus = () => {
  const location = useLocation();
  const {
    serialNumber,
    orderNumber,
    model,
    partDescription,
    rolloutCode,
    partNumber,
    operator,
  } = location.state || {};
  const { lineName, stationName } = useLineStationContext();
  const [data, setData] = useState({
    serialNumber: serialNumber || "",
    orderNumber: orderNumber || "",
    model: model || "",
    partNumber: partNumber || "",
    partDescription: partDescription || "",
    operator: operator || "",
    statusInformation: [],
  });
  const navigate = useNavigate();

  // Fetch data from API when component mounts
  useEffect(() => {
    console.log("Status line:", lineName);
    console.log("Status station:", stationName);
    console.log("Status serial", serialNumber);

    const fetchStatusData = async () => {
      try {
        const response = await axios.post(
          Process_data_button_click,
          {
            Serial_Number: data.serialNumber,
            Line_Name: lineName,
            Station_Name: stationName,
          },
          {
            headers,
          }
        );
        console.log("Station Status Response:", response.data);

        if (
          response.status === 200 &&
          response.data &&
          response.data.Status_Information
        ) {
          const statusInfo = response.data.Status_Information;

          setData((prevState) => ({
            ...prevState,
            statusInformation: statusInfo,
          }));
        } else {
          console.error("Failed to retrieve the correct data structure.");
        }
      } catch (error) {
        console.error("Failed to fetch station status data", error);
      }
    };

    fetchStatusData();
  }, [serialNumber, lineName, stationName]);

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
  return (
    <div className="mainDiv">
      <CContainer>
        <CRow className="mb-4">
          <CCol>
            <h4>Station Status & Process Data</h4>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <CForm>
              <CRow className="headerStation mb-3">
                {[
                  { label: "Serial Number", value: data.serialNumber },
                  { label: "Order Number", value: data.orderNumber },
                  { label: "Model", value: data.model },
                  { label: "Part Number", value: data.partNumber },
                  { label: "Part Description", value: data.partDescription },
                  { label: "Operator", value: data.operator },
                ].map((item, index) => (
                  <CCol key={index} xs={12} sm={6} lg={2}>
                    <CFormLabel className="tlabel">{item.label}</CFormLabel>
                    <CFormInput
                      className="input-box"
                      value={item.value}
                      readOnly
                    />
                  </CCol>
                ))}
              </CRow>
            </CForm>
          </CCol>
        </CRow>

        <CRow>
          <CCol xs={12} md={6}>
            <CCard>
              <CCardHeader>Previous Station Status: Left Side</CCardHeader>
              <CCardBody>
                <div className="table-scroll">
                  <CTable striped bordered hover>
                    <CTableHead className="th">
                      <CTableRow>
                        <CTableHeaderCell>Station Name</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {data.statusInformation.map((row, rowIndex) => (
                        <CTableRow key={rowIndex}>
                          <CTableDataCell>{row.Station_Name}</CTableDataCell>
                          <CTableDataCell>{row.Status}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} md={6}>
            <CCard>
              <CCardHeader>Previous Station Status: Right Side</CCardHeader>
              <CCardBody>
                <div className="table-scroll">
                  <CTable striped bordered hover>
                    <CTableHead className="th">
                      <CTableRow>
                        <CTableHeaderCell>Station Name</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {data.statusInformation.map((row, rowIndex) => (
                        <CTableRow key={rowIndex}>
                          <CTableDataCell>{row.Station_Name}</CTableDataCell>
                          <CTableDataCell>{row.Status}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol>
            <div className="buttons">
              <button className="hbutton" onClick={handleGenealogyClick}>
                {" "}
                Genealogy
              </button>

              <button className="hbutton">Checkpoint</button>
              <button className="hbutton" onClick={handleTorqueButtonClick}>
                {" "}
                Torque
              </button>

              <button className="hbutton">Defect Capture Screen</button>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default StationStatus;
