import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
} from '@coreui/react';
import axios from 'axios';
import { Geneaolgy_button_click, headers } from '../apis/apipath.jsx';
import { useNavigate } from 'react-router-dom';
import { useLineStationContext } from './LineStationContext.jsx';

const Genealogy = () => {
  const { lineName, stationName } = useLineStationContext();

  const location = useLocation();
  const { serialNumber, orderNumber, model, partDescription, partNumber, rolloutCode, operator } = location.state || {}; // Retrieve values from state
  const navigate = useNavigate();

  const [data, setData] = useState({
    serialNumber: serialNumber || '',
    orderNumber: orderNumber || '',
    lineName: lineName || '',
    model: model || '',
    partNumber: partNumber || '',
    partDescription: partDescription || '',
    rolloutCode: rolloutCode || '',
    operator: operator || '',
    tableData: [],
  });

  useEffect(() => {
    const fetchGenealogyData = async () => {
      if (!serialNumber || !stationName) {
        console.error('Missing required parameters');
        return;
      }

      const payload = {
        Serial_Number: serialNumber,
        Station_Name: stationName,
        Line_Name: lineName,
      };

      try {
        const response = await axios.post(Geneaolgy_button_click, payload, {
          headers,
        });
        console.log('API response:', response.data);

        if (response.status === 200 && response.data && response.data.Geneaology_Information) {
          const genealogyInfo = response.data.Geneaology_Information;

          setData((prevState) => ({
            ...prevState,
            tableData: genealogyInfo.map((row) => ({
              ...row,
              newTracibility: false, // Initialize toggle state
              newTracibilityValue: '', // Initialize input value
            })),
          }));
        } else {
          console.error('Failed to retrieve the correct data structure.');
        }
      } catch (error) {
        console.error('Failed to fetch genealogy data', error);
      }
    };

    fetchGenealogyData();
  }, [serialNumber, stationName]);

  const handleToggleChange = (index) => {
    setData((prevState) => {
      const updatedTableData = prevState.tableData.map((row, i) => (i === index ? { ...row, newTracibility: !row.newTracibility } : row));
      return { ...prevState, tableData: updatedTableData };
    });
  };

  const handleInputChange = (index, value) => {
    setData((prevState) => {
      const updatedTableData = prevState.tableData.map((row, i) => (i === index ? { ...row, newTracibilityValue: value } : row));
      return { ...prevState, tableData: updatedTableData };
    });
  };
  const handleTorqueButtonClick = () => {
    navigate('/torque', {
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
    <CContainer>
      <CCardHeader className="g-card-header">Genealogy</CCardHeader>
      <CCardBody>
        <CForm>
          <CRow className="mb-3">
            {[
              { label: 'Serial Number', value: data.serialNumber },
              { label: 'Order Number', value: data.orderNumber },
              { label: 'Model', value: data.model },
              { label: 'Part Number', value: data.partNumber },
              { label: 'Part Description', value: data.partDescription },
              { label: 'Rollout Code', value: data.rolloutCode },
              { label: 'Operator', value: data.operator },
            ].map((item, index) => (
              <CCol key={index} xs={12} sm={6} lg={2}>
                <CFormLabel className="g-label">{item.label}</CFormLabel>
                <CFormInput className="g-input-box" value={item.value} readOnly />
              </CCol>
            ))}
          </CRow>
        </CForm>
        <div className="g-table-container">
          <CCard>
            <CCardBody>
              <div className="g-table-wrapper">
                <CTable hover>
                  <CTableHead className="g-th">
                    <CTableRow>
                      <CTableHeaderCell>Station Name</CTableHeaderCell>
                      <CTableHeaderCell>Part Class</CTableHeaderCell>
                      <CTableHeaderCell>Part Number</CTableHeaderCell>
                      <CTableHeaderCell>Capture Tracibility</CTableHeaderCell>
                      <CTableHeaderCell>New Tracibility</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody className="g-table-data">
                    {data.tableData.map((row, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{row.Station_Name}</CTableDataCell>
                        <CTableDataCell>{row.Part_Class}</CTableDataCell>
                        <CTableDataCell>{row.Part_Number}</CTableDataCell>
                        <CTableDataCell>{row.Captured_Tracibility}</CTableDataCell>
                        <CTableDataCell>
                          <div className="g-toggle-input-container">
                            <input
                              type="checkbox"
                              checked={row.newTracibility}
                              onChange={() => handleToggleChange(index)}
                              className="g-toggle-checkbox"
                            />
                            {row.newTracibility && (
                              <CFormInput
                                value={row.newTracibilityValue}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                className="g-input-box"
                                style={{ marginLeft: '1rem' }} // Space between toggle and input
                              />
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </div>
        <div className="g-button-container">
          <button className="hbutton">Checkpoint</button>
          <button className="hbutton" onClick={handleTorqueButtonClick}>
            {' '}
            Torque
          </button>

          <button className="hbutton">Defect Capture Screen</button>
          <button className="hbutton">Clear</button>
        </div>
      </CCardBody>
    </CContainer>
  );
};

export default Genealogy;
