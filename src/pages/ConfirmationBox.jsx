import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
const ConfirmationBox = ({ title, message, onConfirm, onCancel, visible }) => {
  return (
    <CModal visible={visible} onClose={onCancel}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="danger" style={{ color: 'white' }} onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="success" style={{ color: 'white' }} onClick={onConfirm}>
          Confirm
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConfirmationBox;
