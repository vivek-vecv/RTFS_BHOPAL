import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

const TorqueModal = ({ isVisible, toggleVisibility, torqueData, sfc }) => {
  return (
    <CModal visible={isVisible} onClose={toggleVisibility} backdrop={true} size="lg">
      <CModalHeader className="text-center fw-bold">
        Torque Information - <span className="bg-info rounded p-1 text-white mx-1"> {sfc}</span>{' '}
      </CModalHeader>
      <CModalBody className="scrollable-modal-body">
        {torqueData && torqueData.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="bg-primary text-white ">Torque Status</th>
                <th className="bg-primary text-white ">Torque Name</th>
                <th className="bg-primary text-white ">Station Name</th>
                <th className="bg-primary text-white ">Torque Sequence</th>
                <th className="bg-primary text-white ">Torque Value</th>
              </tr>
            </thead>
            <tbody>
              {torqueData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Torque_Status}</td>
                  <td>{item.Torque_Name}</td>
                  <td>{item.Station_Name}</td>
                  <td>{item.Torque_Sequence}</td>
                  <td>{item.Torque_Value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No torque data available.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={toggleVisibility}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TorqueModal;
