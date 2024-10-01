import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CContainer,
  CForm,
} from "@coreui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Torque_button_click, headers } from "../apis/apipath.jsx";

import "./torque.css"; // Import the custom CSS

const TorqueDashboard = () => {
  const location = useLocation();
  const {
    serialNumber,
    lineName,
    stationName,
    orderNumber,
    model,
    partDescription,
    partNumber,
    operator,
  } = location.state || {}; // Retrieve values from state
  const navigate = useNavigate();
  const [data, setData] = useState({
    serialNumber: serialNumber || "",
    orderNumber: orderNumber || "",
    model: model || "",
    partNumber: partNumber || "",
    partDescription: partDescription || "",
    operator: operator || "",
    tableData: [],
  });
  console.log("orderNum:", orderNumber);

  useEffect(() => {
    console.log("Serial Number:", serialNumber);
    console.log("Line Name:", lineName);
    console.log("Station Name:", stationName);
    const fetchTorqueData = async () => {
      if (!serialNumber || !lineName || !stationName) {
        console.error("Missing required parameters");
        return;
      }

      const payload = {
        Serial_Number: serialNumber,
        Line_Name: lineName,
        Station_Name: stationName,
      };

      try {
        const response = await axios.post(Torque_button_click, payload, {
          headers,
        });

        if (
          response.status === 200 &&
          response.data &&
          response.data.Torque_Information
        ) {
          const torqueInfo = response.data.Torque_Information; // Assuming Torque_Information is the correct array

          setData((prevState) => ({
            ...prevState,
            tableData: torqueInfo, // Set the tableData to the Torque_Information array
          }));
        } else {
          console.error("Failed to retrieve the correct data structure.");
        }
      } catch (error) {
        console.error("Failed to fetch torque data", error);
      }
    };

    fetchTorqueData();
  }, [serialNumber, lineName, stationName]);

  const handleStationStatusButtonClick = () => {
    navigate("/stationStatus", {
      state: {
        serialNumber,
        orderNumber,
        model,
        partDescription,
        partNumber,
        operator,
      },
    });
  };

  return (
    <CContainer>
      <CCardHeader className="card-header">Torque</CCardHeader>
      <CCardBody>
        <CForm>
          <CRow className="mb-3">
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
                <CFormInput className="input-box" value={item.value} readOnly />
              </CCol>
            ))}
          </CRow>
        </CForm>
        <div className="table-container">
          <CCard>
            <CCardBody>
              <div className="table-wrapper">
                <CTable hover>
                  <CTableHead className="th">
                    <CTableRow>
                      <CTableHeaderCell>Station Name</CTableHeaderCell>
                      <CTableHeaderCell>Torque Name</CTableHeaderCell>
                      <CTableHeaderCell>Torque Sequence</CTableHeaderCell>
                      <CTableHeaderCell>Torque Status</CTableHeaderCell>
                      <CTableHeaderCell>Torque Value</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody className="table-data">
                    {data.tableData.map((row, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{row.Station_Name}</CTableDataCell>
                        <CTableDataCell>{row.Torque_Name}</CTableDataCell>
                        <CTableDataCell>{row.Torque_Seq}</CTableDataCell>
                        <CTableDataCell>{row.Torque_Status}</CTableDataCell>
                        <CTableDataCell>{row.Torque_Value}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </div>
        <div className="button-container">
          <button className="hbutton">Checkpoint</button>
          <button onClick={handleStationStatusButtonClick} className="hbutton">
            {" "}
            Process Data
          </button>

          <button className="hbutton">Defect Capture Screen</button>
        </div>
      </CCardBody>
    </CContainer>
  );
};

export default TorqueDashboard;
