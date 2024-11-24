import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CForm } from '@coreui/react';

const AddOperator = ({ isVisible, station, shift, onClose, fetchAuditors }) => {
  const [error, setError] = useState('');
  const [operatorName, setOperatorName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://10.119.1.101:9898/rest/api/addOperatorDataByStation?Station_Name=${station}&Shift_Name=${shift}&Operator_Name=${operatorName}`,
        {
          auth: {
            username: 'arun',
            password: '123456',
          },
        }
      );
      if (response.status === 200) {
        toast.success('Operator added successfully');
        onClose(); // Close the modal after success
        fetchAuditors();
        setOperatorName('');
      }
    } catch (error) {
      setError(`Failed to add operator. Please try again.${error}`);
    }
  };

  if (!isVisible) return null;

  return (
    <CModal visible={isVisible} onClose={onClose}>
      <CForm onSubmit={handleSubmit}>
        <CModalHeader className="fw-bold">Add Operator</CModalHeader>
        <CModalBody>
          <div className="d-flex">
            <label htmlFor="addOperator" className="form-label fw-bold m-0">
              Operator Name
            </label>
            <div className="input-group">
              <input
                type="text"
                id="addOperator"
                className="form-control"
                placeholder="Enter Operator Name"
                onChange={(e) => setOperatorName(e.target.value)}
                value={operatorName}
              />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className="btn btn-info text-white fw-bold" onClick={handleSubmit}>
            Add Operator
          </CButton>
          {/* <CButton className="btn btn-danger text-white fw-bold" onClick={}>
          Cancel
          </CButton> */}
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddOperator;
