import React, { useState, useEffect, memo } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CFormInput,
} from "@coreui/react";
import axios from "axios";
import "./operatorModel.css";
import { Operator_login, delete_operator, headers } from "../apis/apipath.jsx";
import { useLineStationContext } from "./LineStationContext.jsx";

const OperatorModal = ({ visible, onClose, onSelectOperator }) => {
  const { stationName } = useLineStationContext();
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [newOperatorName, setNewOperatorName] = useState("");
  const [newOperatorShift, setNewOperatorShift] = useState("");
  const [showNewOperatorInputs, setShowNewOperatorInputs] = useState(false);

  useEffect(() => {
    if (visible && stationName) {
      const fetchOperators = async () => {
        try {
          const response = await axios.post(
            Operator_login,
            { Station_Name: stationName },
            {
              headers,
            }
          );
          setOperators(response.data.Operator_Information || []);
        } catch (error) {
          console.error(
            "Error fetching operators:",
            error.response ? error.response.data : error.message
          );
        }
      };
      fetchOperators();
    }
  }, [visible, stationName]);

  const handleRowClick = (operator) => {
    setSelectedOperator(operator);
  };

  const handleAddOperator = () => {
    setShowNewOperatorInputs(true);
  };

  const handleSaveNewOperator = async () => {
    if (!newOperatorName || !newOperatorShift) {
      console.error("Operator Name and Shift are required");
      return;
    }

    const now = new Date();
    const lastLogged = now.toLocaleString("en-GB");

    const newOperator = {
      Operator_Name: newOperatorName,
      Shift_Name: newOperatorShift,
      Station_Name: stationName,
      Last_Log: lastLogged,
    };

    try {
      const response = await axios.post(Operator_login, newOperator, {});

      if (response.status === 200) {
        setOperators([...operators, newOperator]);
        setSelectedOperator(newOperator);
        setShowNewOperatorInputs(false);
        setNewOperatorName("");
        setNewOperatorShift("");
      } else {
        console.error("Failed to save new operator:", response.data);
      }
    } catch (error) {
      console.error(
        "Error saving new operator:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteOperator = async () => {
    if (!selectedOperator) {
      console.error("No operator selected");
      return;
    }

    const payload = {
      Operator_Name: selectedOperator.Operator_Name,
      Shift_Name: selectedOperator.Shift,
      Station_Name: stationName,
    };

    try {
      const response = await axios.post(delete_operator, payload, { headers });

      if (response.status === 200) {
        setOperators(
          operators.filter(
            (op) => op.Operator_Name !== selectedOperator.Operator_Name
          )
        );
        setSelectedOperator(null);
      } else {
        console.error("Failed to delete operator:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting operator:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleOk = () => {
    if (selectedOperator) {
      onSelectOperator(selectedOperator.Operator_Name);
    }
    onClose();
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Operator Login</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="table-wrapper">
          <CTable hover className="table-wrapper">
            <CTableHead className="th">
              <CTableRow>
                <CTableHeaderCell>Operator Name</CTableHeaderCell>
                <CTableHeaderCell>Shift</CTableHeaderCell>
                <CTableHeaderCell>Last Logged</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody className="table-data">
              {operators.length > 0 ? (
                operators.map((operator, index) => (
                  <CTableRow
                    key={index}
                    onClick={() => handleRowClick(operator)}
                    active={
                      selectedOperator &&
                      selectedOperator.Operator_Name === operator.Operator_Name
                    }
                  >
                    <CTableDataCell>{operator.Operator_Name}</CTableDataCell>
                    <CTableDataCell>{operator.Shift}</CTableDataCell>
                    <CTableDataCell>{operator.Last_Log}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="3">No data available</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
        {showNewOperatorInputs && (
          <div className="new-operator-inputs">
            <CFormInput
              type="text"
              placeholder="New Operator Name"
              value={newOperatorName}
              onChange={(e) => setNewOperatorName(e.target.value)}
            />
            <CFormInput
              type="text"
              placeholder="New Operator Shift"
              value={newOperatorShift}
              onChange={(e) => setNewOperatorShift(e.target.value)}
            />
            <CButton color="success" onClick={handleSaveNewOperator}>
              Save New Operator
            </CButton>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleOk}>
          Ok
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        <CButton color="success" onClick={handleAddOperator}>
          New Operator
        </CButton>
        {selectedOperator && (
          <CButton color="danger" onClick={handleDeleteOperator}>
            Delete Operator
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

// Assigning displayName to the memoized component to fix the ESLint error
const MemoizedOperatorModal = memo(OperatorModal);
MemoizedOperatorModal.displayName = "OperatorModal";

export default MemoizedOperatorModal;
