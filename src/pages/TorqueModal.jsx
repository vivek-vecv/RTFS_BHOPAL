import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

const TorqueModal = ({ visible, onClose, torqueData, sfc }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="fullscreen">
      <CModalHeader className="text-center fw-bold">
        Torque Information - <span className="bg-info rounded p-1 text-white mx-1"> {sfc}</span>{' '}
      </CModalHeader>
      <CModalBody className="scrollable-modal-body">
        {torqueData && torqueData.length > 0 ? (
          <div className="table-responsive overflow-auto" style={{ maxHeight: '100%' }}>
            <table className="table table-hover table-striped border border-start border-end text-center border-top-0">
              <thead className="position-sticky top-0">
                <tr>
                  <th className="bg-primary text-white ">Torque Status</th>
                  <th className="bg-primary text-white ">Torque Name</th>
                  <th className="bg-primary text-white ">Station Name</th>
                  <th className="bg-primary text-white ">Torque Sequence</th>
                  <th className="bg-primary text-white ">Torque Value</th>
                </tr>
              </thead>
              <tbody className="align-items-center">
                {torqueData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ color: item.Torque_Status === 'OK' ? 'green' : 'red' }}>{item.Torque_Status}</td>
                    <td>{item.Torque_Name}</td>
                    <td>{item.Station_Name}</td>
                    <td>{item.Torque_Sequence}</td>
                    <td>{item.Torque_Value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No torque data available.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TorqueModal;
