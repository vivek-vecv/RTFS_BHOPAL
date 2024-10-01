import React, { useState } from 'react';
import { CContainer, CRow, CCol, CButton, CFormInput, CFormLabel, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CFormSelect } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css'; // Import CoreUI styles
import './CheckpointScreen.css'; // Import custom styles

const CheckpointScreen = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCheckpoints, setFilteredCheckpoints] = useState([]);
  const [data, setData] = useState([
    { id: 1, checkpoint: "Ensure Front plate 2 M12 bolts tightening", status: "OK", remark: "" },
    { id: 2, checkpoint: "Ensure connection is done as per colour coding on both plate and bunch", status: "OK", remark: "" },
    { id: 3, checkpoint: "Ensure 4 M16 lock nut 2 M14 lock nut present full tightened in all 6 pipes", status: "OK", remark: "" },
    { id: 4, checkpoint: "Horn mounting on vehicle and tightening with 1 M8 bolt", status: "OK", remark: "" },
    { id: 5, checkpoint: "Front cross member harness coupler mtg bkt with 1 M8 bolt should be tight", status: "OK", remark: "" },
    { id: 6, checkpoint: "2 Harness coupler should be mounted on bkt and locked", status: "OK", remark: "" },
    { id: 7, checkpoint: "Ensure routing & clamping as per SOP", status: "OK", remark: "" }
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.checkpoint.toLowerCase().includes(searchTerm)
    );
    setFilteredCheckpoints(filtered);
  };

  const handleStatusToggle = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'OK' ? 'NOK' : 'OK', remark: '' } // Reset remark when toggling status
          : item
      )
    );
  };

  const handleRemarkChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, remark: value } : item
      )
    );
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text; // Return the original text if the highlight is empty
  
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <CContainer>
      <CRow className="mb-4">
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="serialNumber">Serial Number</CFormLabel>
          <CFormInput id="serialNumber" />
        </CCol>
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="orderNumber">Order Number</CFormLabel>
          <CFormInput id="orderNumber" />
        </CCol>
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="model">Model</CFormLabel>
          <CFormInput id="model" />
        </CCol>
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="partNumber">Part Number</CFormLabel>
          <CFormInput id="partNumber" />
        </CCol>
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="partDescription">Part Description</CFormLabel>
          <CFormInput id="partDescription" />
        </CCol>
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="rolloutCode">Rollout Code</CFormLabel>
          <CFormInput id="rolloutCode" />
        </CCol>
        <CCol md={2} className="header-item">
          <CFormLabel htmlFor="operator">Operator</CFormLabel>
          <CFormInput id="operator" />
        </CCol>
      </CRow>

      <CRow className="mb-4 search-container">
        <CCol>
          <CFormInput
            type="text"
            placeholder="Enter keyword to search..."
            className="search-input"
            onChange={handleSearchChange}
          />
          <CButton color="primary" onClick={handleSearch} className="ms-2">
            Search
          </CButton>
        </CCol>
      </CRow>

      <CTable hover responsive className="">
        <CTableHead className="table-head">
          <CTableRow>
            <CTableDataCell>Sr.</CTableDataCell>
            <CTableDataCell>Checkpoint</CTableDataCell>
            <CTableDataCell>Status</CTableDataCell>
            <CTableDataCell>Remark</CTableDataCell>
            <CTableDataCell>Last User</CTableDataCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {(filteredCheckpoints.length > 0 ? filteredCheckpoints : data).map((item, index) => (
            <CTableRow key={item.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>
                {highlightText(item.checkpoint, searchTerm)}
              </CTableDataCell>
              <CTableDataCell>
                <CButton color={item.status === 'OK' ? 'success' : 'danger'} onClick={() => handleStatusToggle(item.id)}>
                  {item.status}
                </CButton>
              </CTableDataCell>
              <CTableDataCell>
                {item.status === 'NOK' ? (
                  <CFormSelect
                    value={item.remark}
                    onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                  >
                    <option value="">Select a remark</option>
                    <option value="Tightening Issue">Tightening Issue</option>
                    <option value="Connection Problem">Connection Problem</option>
                    <option value="Missing Part">Missing Part</option>
                    <option value="Misalignment">Misalignment</option>
                  </CFormSelect>
                ) : (
                  <CFormInput
                    type="text"
                    value={item.remark}
                    onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                    disabled={item.status === 'OK'}
                  />
                )}
              </CTableDataCell>
              <CTableDataCell></CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CRow className="mt-4 justify-content-center">
        <CCol md="auto" className="d-flex justify-content-center">
          <CButton className="me-2" color="primary">Save</CButton>
          <CButton onClick={() => navigate('Gen')} className="ms-2" color="primary">Defect Capture Screen</CButton>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default CheckpointScreen;
