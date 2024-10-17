import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CButton, CSpinner, CModal, CModalHeader, CModalBody, CFormCheck, CFormInput, CModalFooter, CModalTitle } from '@coreui/react';
import { toast } from 'react-toastify';
import { BsQrCode } from 'react-icons/bs';
import BarcodeScanner from './BarcodeScanner.jsx';
import { useNavbar } from '../context/NavbarContext.jsx';
import AddOperator from './AddOperator.jsx';
import TorqueModal from './TorqueModal.jsx';
import ConfirmationBox from './ConfirmationBox.jsx';
const Checkmansheet = () => {
  // const [selectedComponent, setSelectedComponent] = useState(null);
  const [param, setParam] = useState({});
  const [showButtons, setShowButtons] = useState(true); // State to manage button visibility

  const handleButtonClick = (paramValue) => {
    setParam(paramValue);
    setShowButtons(false); // Hide buttons after selection
  };

  const params = [
    { line: 'Chassis', station: 'QG01L', direction: 'Left' },
    { line: 'Chassis', station: 'QG01R', direction: 'Right' },
    { line: 'Chassis', station: 'QG02L', direction: 'Left' },
    { line: 'Chassis', station: 'QG02R', direction: 'Right' },
    { line: 'Chassis', station: 'QG03L', direction: 'Left' },
    { line: 'Chassis', station: 'QG03R', direction: 'Right' },
    { line: 'Cabtrim', station: 'QG01' },
    { line: 'Cabtrim', station: 'QG02' },
    { line: 'Cabtrim', station: 'QG03' },
  ];

  // Categorize params based on line
  const chassisParams = params.filter((item) => item.line === 'Chassis');
  const cabtrimParams = params.filter((item) => item.line === 'Cabtrim');

  return (
    <div>
      {showButtons && (
        <div className="container mt-4">
          <h3>Select Line and Station</h3>
          <div className="border border-2 border-info rounded p-3 mb-4 shadow-sm">
            <h3 className="h5">Chassis</h3>
            <div className="row">
              {chassisParams.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3">
                  <CButton onClick={() => handleButtonClick(item)} className="btn-primary w-100 mb-3 fw-bold">
                    {`${item.line} ${item.station} ${item.direction ? item.direction : ''}`}
                  </CButton>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-2 border-info rounded p-3 mb-4 shadow-sm">
            <h3 className="h5">Cabtrim</h3>
            <div className="row">
              {cabtrimParams.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3">
                  <CButton onClick={() => handleButtonClick(item)} className="btn-secondary w-100 mb-3 fw-bold">
                    {`${item.line} ${item.station}`}
                  </CButton>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!showButtons &&
        param && ( // Render MyComponent if parameters are set
          <QGComponent param={param} />
        )}
    </div>
  );
};

export const QGComponent = ({ param }) => {
  const { setNavbarData } = useNavbar();
  setNavbarData(param);

  const [dataFetchLoading, setDataFetchLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [chassisNumber, setChassisNumber] = useState('');
  const [auditorOptions, setAuditorOptions] = useState([]);
  const [genealogyData, setGenealogyData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serialInfo, setSerialInfo] = useState({
    Series: '',
    Engine_Number: '',
    Model: '',
    Rollout_Date: '',
    Serial_Number: '',
  });
  const [checkPointData, setCheckPointData] = useState([]);
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [totalDefects, setTotalDefects] = useState(0);
  const [totalDemerits, setTotalDemerits] = useState(0);
  const [auditDate, setAuditDate] = useState('');
  const [defectStatuses, setDefectStatuses] = useState({});
  const [defectOptions, setDefectOptions] = useState({});
  const [selectedDefects, setSelectedDefects] = useState({});
  const [geneLoading, setGeneloading] = useState(false);
  const [isTorqueModalVisible, setIsTorqueModalVisible] = useState(false);
  const [torqueData, setTorqueData] = useState([]);
  const [isOpModalOpen, setOpModalOpen] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const operatorModal = () => {
    setOpModalOpen(true);
  };
  const closeoperatorModal = () => {
    setOpModalOpen(false);
  };

  const emptyModel = () => {
    setTotalDefects(0);
    setTotalDemerits(0);
    setChassisNumber('');
    setDefectOptions([]);
    // setAuditorOptions([]);
    setDefectOptions([]);
    setSelectedAuditor(null);
    setSelectedDefects({});
    setSerialInfo({
      Station: '',
      Fuel_Type: '',
      Model: '',
      Line: '',
      Serial_Number: '',
      Shift: '',
      Order_Number: '',
      Model_Desc: '',
      Halb_Code: '',
      Fert_Code: '',
    });
    setAuditDate('');
    checkPointData([]);

    const initialStatuses = checkPointData.reduce((acc, checkpoint) => {
      acc[checkpoint.Checkpoint_Id] = 'ok'; // Default status is 'ok'
      return acc;
    }, {});

    setDefectStatuses(initialStatuses);
  };

  const handleGenealogy = async () => {
    if (chassisNumber) {
      setGeneloading(true); // Set loading to true before making the API call
      try {
        const response = await axios.get(
          `http://10.119.1.101:9898/rest/api/getGeneaologyByStationSerial?Serial_Number=${chassisNumber}&Line_Name=${param.line}&Station_Name=${param.station}`,
          {
            auth: {
              username: 'arun',
              password: '123456',
            },
          }
        );
        setGenealogyData(response.data.Geneaology_Information);
        setGeneloading(false);
        setIsModalOpen(true);
      } catch (error) {
        setGeneloading(false);

        toast.error('Error in fetching data ', error);
      }
    } else {
      toast.error('Please enter chassis number');
    }
  };

  const handleTorqueData = async () => {
    if (chassisNumber) {
      try {
        const response = await axios.get(
          `http://10.119.1.101:9898/rest/api/getTorqueByStationSerial?Serial_Number=${chassisNumber}&Line_Name=${param.line}&Station_Name=${param.station}`
        );
        setTorqueData(response.data.Torque_Information);
        setIsTorqueModalVisible(true);
      } catch (error) {
        console.error('Error fetching torque data:', error);
      }
    } else {
      toast.error('Please enter chassis number');
    }
  };

  const torqueModalClose = () => {
    setIsTorqueModalVisible(false);
  };

  const fetchSerialNumberDetails = async (serialNumber) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getQualityGateSerialNumberByLineName/?Serial_Number=${serialNumber}&Line_Name=${param.line}&Station_Name=${param.station}`,
        {
          auth: {
            username: 'arun',
            password: '123456',
          },
        }
      );

      if (response.status === 200) {
        const serialInformation = response.data.Header_Details[0];
        setSerialInfo({
          Station: serialInformation.Station,
          Fuel_Type: serialInformation.Fuel_Type,
          Model: serialInformation.Model,
          Line: serialInformation.Line,
          Serial_Number: serialInformation.Serial_Number,
          Shift: serialInformation.Shift,
          Order_Number: serialInformation.Order_Number,
          Model_Desc: serialInformation.Model_Desc,
          Halb_Code: serialInformation.Halb_Code,
          Fert_Code: serialInformation.Fert_Code,
        });

        const checkPointData = response.data.Checkpoint_table_Details;
        if (checkPointData.length) {
          setCheckPointData(checkPointData);
        } else {
          toast.info(`No checkpoint available for ${param.line}-${param.station}`);
        }

        const initialStatuses = checkPointData.reduce((acc, checkpoint) => {
          acc[checkpoint.Checkpoint_Id] = 'ok'; // Default status is 'ok'
          return acc;
        }, {});
        setDefectStatuses(initialStatuses);
        return serialInformation.Serial_Number;
      }
    } catch (error) {
      console.error('Error fetching serial number details:', error);
    }
  };

  const fetchChassisNumber = async (value) => {
    setDataFetchLoading(true);
    try {
      if (value.length >= 6) {
        const chassis = await fetchSerialNumberDetails(value);
        if (chassis) {
          setChassisNumber(chassis);
          fetchAuditors();
        }
      }
      setDataFetchLoading(false);
    } catch (error) {
      setDataFetchLoading(false);
      console.error('Error fetching serial details :', error);
    }
  };

  const handleChassisNumberChange = async (e) => {
    const value = e.target.value;
    setChassisNumber(value);
    fetchChassisNumber(value);
  };

  const fetchAuditors = async () => {
    try {
      const response = await axios.get(`http://10.119.1.101:9898/rest/api/getOperatorDataByStation?Station_Name=${param.station}`, {
        auth: {
          username: 'arun',
          password: '123456',
        },
      });

      if (response.status === 200) {
        const auditorsList = response.data.Operator_Information || [];
        setAuditorOptions(
          auditorsList.map((auditor) => ({
            value: auditor.Operator_Name,
            label: auditor.Operator_Name,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching auditors:', error);
    }
  };

  const handleAuditorChange = async (selectedOption) => {
    if (selectedOption) {
      setSelectedAuditor(selectedOption);
    }
  };

  useEffect(() => {
    if (chassisNumber) {
      fetchHeaderData(chassisNumber);
    }
  }, [chassisNumber]);

  const fetchHeaderData = (chassisNumber) => {
    console.log(`Fetching data for chassis: ${chassisNumber}`);
    // setIsDisabled(false);
  };

  useEffect(() => {
    fetchAuditors();
  }, []);

  //==============================Submit function code ===================================================

  const handleSubmit = async () => {
    console.log('------------------running-------------------\n');

    if (chassisNumber) {
      if (selectedAuditor) {
        if (Object.keys(selectedDefects).length) {
          try {
            for (const checkpointId in selectedDefects) {
              const selectedOptions = selectedDefects[checkpointId];
              for (const defect of selectedOptions) {
                const CheckpointDefectList = {
                  Checkpoint_Name: checkPointData.find((cp) => cp.Checkpoint_Id === checkpointId).Checkpoint_Name,
                  Defect_Name: defect.value,
                  Line_Name: param.line,
                  Station_Name: param.station,
                  Operator_Name: selectedAuditor.value,
                  Status: defectStatuses[checkpointId],
                  Remark: checkpointId,
                  Shift_Name: 'A',
                  Username: '',
                };

                const response = await axios.post(
                  `http://10.119.1.101:9898/rest/api/saveCheckpointDefects?CheckpointDefectList=${encodeURIComponent(
                    JSON.stringify(CheckpointDefectList)
                  )}&Serial_Number=${chassisNumber}`,

                  {
                    auth: {
                      username: 'arun',
                      password: '123456',
                    },
                  }
                );

                if (response.status === 200) {
                  toast.success(`Defect ${defect.value} for checkpoint ${checkpointId} saved successfully!`);
                } else {
                  toast.error(`Failed to save defect ${defect.value} for checkpoint ${checkpointId}`);
                }
              }
            }
          } catch (error) {
            toast.error('Error saving defects:', error);
          }
        } else {
          setConfirmationVisible(true);
        }
      } else {
        toast.error('Please select operator name');
      }
    } else {
      toast.error('please enter chassis number');
    }
  };

  const reactSelectPopupStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 10000, // Adjust this value as needed
    }),
  };

  // Function to handle scanned value
  const handleScan = (value) => {
    setChassisNumber(value);
    setModalVisible(false); // Set the scanned value in input field
    fetchChassisNumber(value);
  };
  const handleQrClick = () => {
    setModalVisible(true);
  };

  const handleStatusChange = async (checkpointId, value) => {
    setDefectStatuses((prev) => ({
      ...prev,
      [checkpointId]: value,
    }));

    // Fetch defects only if "NOK" is selected
    if (value === 'nok') {
      try {
        const response = await axios.get(
          `http://10.119.1.101:9898/rest/api/getCheckpointDefects?Line_Name=${param.line}&Station_Name=${param.station}&Checkpoint_Id=${checkpointId}`
        );

        // Group defects based on Checkpoint_Id
        const defectsForCheckpoint = response.data['Checkpoint Defect_List'].reduce((acc, defect) => {
          const checkpointId = defect.Checkpoint_Id;

          // Initialize an empty array if checkpointId is not already in acc
          if (!acc[checkpointId]) {
            acc[checkpointId] = [];
          }

          // Add defect to the corresponding checkpointId array
          acc[checkpointId].push({
            value: defect.Defect_Name,
            label: defect.Defect_Name,
          });

          return acc;
        }, {});

        // Merge new defects with the existing state
        setDefectOptions((prev) => ({
          ...prev,
          ...defectsForCheckpoint,
        }));
      } catch (error) {
        console.error('Error fetching defects:', error);
      }
    }

    //==================================================

    if (value === 'ok') {
      try {
        setSelectedDefects((prev) => {
          const updatedDefects = { ...prev };
          delete updatedDefects[checkpointId]; // Remove defects for this checkpoint
          return updatedDefects;
        });
      } catch (error) {
        console.error('Error fetching defects:', error);
      }
    }
  };

  const handleSelectedDefects = (checkpointId, selectedOption) => {
    setSelectedDefects((prev) => ({
      ...prev,
      [checkpointId]: selectedOption,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const CheckpointDefectList = {
        Checkpoint_Name: '',
        Defect_Name: '',
        Line_Name: param.line,
        Station_Name: param.station,
        Operator_Name: selectedAuditor.value,
        Status: 'All Ok',
        Remark: 'All Ok',
        Shift_Name: 'A',
        Username: 'Vivek',
      };

      const response = await axios.post(
        `http://10.119.1.101:9898/rest/api/saveCheckpointDefects?CheckpointDefectList=${encodeURIComponent(
          JSON.stringify(CheckpointDefectList)
        )}&Serial_Number=${chassisNumber}`,
        {
          auth: {
            username: 'arun',
            password: '123456',
          },
        }
      );

      if (response.status === 200) {
        toast.success(`All OK saved successfully!`);
        emptyModel();
      } else {
        toast.error(`Failed to save all ok`);
      }
    } catch (error) {
      toast.error('Error saving defects:', error);
    }
    setConfirmationVisible(false);
  };

  const handleCancel = () => {
    setConfirmationVisible(false);
  };

  return (
    <>
      {dataFetchLoading ? (
        <div
          className="position-fixed top-0 d-flex justify-content-center align-items-center vw-100 vh-100 bg-white bg-opacity-75"
          style={{ zIndex: 15000 }}
        >
          <CSpinner className="text-danger mx-auto" />
        </div>
      ) : null}
      <div className="container-fluid pt-3">
        {/* 1st Div: 4 divs side by side */}
        <div className="first-section row justify-content-center gap-2">
          <div className="col-12 row">
            <div className="col-12 col-sm-6 col-lg-4">
              <label htmlFor="chassisNumber" className="form-label fw-bold m-0">
                Chassis Number
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="chassisNumber"
                  className="form-control"
                  placeholder="Enter Chassis Number"
                  onChange={handleChassisNumberChange}
                  value={chassisNumber}
                />
                <BsQrCode
                  className="input-group-text p-1"
                  size={40}
                  onClick={handleQrClick}
                  style={{ cursor: 'pointer' }}
                  color="var(--cui-primary)"
                />
              </div>
              <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader className="fw-bold">Scan Bar/QR code</CModalHeader>
                <CModalBody className="p-0">
                  <BarcodeScanner onScan={handleScan} />
                </CModalBody>
              </CModal>
            </div>
            <div className="col-12 col-sm-3 col-lg-4">
              <label htmlFor="engineNumber" className="form-label fw-bold m-0">
                Fert Code
              </label>
              <input type="text" id="engineNumber" className="form-control disabled-input" value={serialInfo.Fert_Code} disabled={true} />
            </div>

            <div className="col-12 col-sm-3 col-lg-4">
              <label htmlFor="series" className="form-label fw-bold m-0">
                Order No.
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Order_Number} disabled={true} />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-2 col-lg-3">
              <label htmlFor="series" className="form-label fw-bold m-0">
                Station
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Station} disabled={true} />
            </div>
            <div className="col-12 col-sm-4 col-lg-3">
              <label htmlFor="model" className="form-label fw-bold m-0">
                Model
              </label>
              <input type="text" id="model" className="form-control disabled-input" value={serialInfo.Model} disabled={true} />
            </div>
            <div className="col-12 col-sm-6 col-lg-6">
              <label htmlFor="series" className="form-label fw-bold m-0">
                Model Desc
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Model_Desc} disabled={true} />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-3">
              <label htmlFor="rolloutDate" className="form-label fw-bold m-0">
                Halb Code
              </label>
              <input type="text" id="rolloutDate" className="form-control disabled-input" value={serialInfo.Halb_Code} disabled={true} />
            </div>
            <div className="col-12 col-sm-3">
              <label htmlFor="rolloutShift" className="form-label fw-bold m-0">
                Shift
              </label>
              <input type="text" value={serialInfo.Shift} id="rolloutShift" className="form-control disabled-input" disabled={true} />
            </div>
            <div className="col-12 col-sm-3">
              <label htmlFor="totalDefectCount" className="form-label fw-bold m-0">
                Total Defects
              </label>
              <input type="text" id="totalDefectCount" className="form-control disabled-input" value={totalDefects} disabled={true} />
            </div>
            <div className="col-12 col-sm-3">
              <label htmlFor="totalDemerit" className="form-label fw-bold m-0">
                Total Demerit
              </label>
              <input type="text" id="totalDemerit" className="form-control disabled-input" value={totalDemerits} disabled={true} />
            </div>
          </div>
          <div className="col-12 col-md-6 row">
            <div className="col-12 col-sm-6 col-md-6">
              <label htmlFor="inspectionDate" className="form-label fw-bold m-0">
                Inspection Date
              </label>
              <div>
                <DatePicker
                  selected={auditDate}
                  onChange={(date) => setAuditDate(date)}
                  showTimeSelect
                  disabled={!chassisNumber}
                  className="form-control w-100"
                  dateFormat="Pp"
                  timeFormat="HH:mm"
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormatCalendar="MMMM"
                  placeholderText="Select date and time"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6">
              <label htmlFor="inspectorName" className="form-label fw-bold m-0">
                Operator Name
              </label>
              <Select
                options={auditorOptions}
                placeholder="Select Operator"
                isClearable
                styles={reactSelectPopupStyles}
                onChange={handleAuditorChange}
                value={selectedAuditor ? { value: selectedAuditor.value, label: selectedAuditor.label } : null}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-end align-items-end gap-2  mt-4 flex-wrap">
              <CButton className="btn btn-success text-white fw-bold" onClick={handleSubmit}>
                Submit
              </CButton>
              <CButton className="btn btn-primary fw-bold" onClick={emptyModel}>
                Reset
              </CButton>
              <CButton className="btn btn-primary fw-bold" onClick={operatorModal}>
                Add/Remove Operator
              </CButton>
              <CButton className="btn btn-info text-white fw-bold" onClick={handleGenealogy}>
                Genealogy
              </CButton>
              <CButton className="btn btn-warning text-white fw-bold" onClick={handleTorqueData}>
                Torque
              </CButton>
            </div>
          </div>
        </div>

        <hr />

        {/* genealogy and torque data modal */}
        <div>
          {isModalOpen && (
            <CModal size="fullscreen" visible={isModalOpen} onClose={closeModal}>
              <CModalHeader className="position-sticky top-0">
                <CModalTitle>
                  Genealogy Information - <span className="bg-info my-1 mx-1 p-1 rounded-1 text-white">{chassisNumber}</span>
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                {genealogyData && (
                  <div className="table-responsive overflow-auto" style={{ maxHeight: '70vh' }}>
                    <table className="table table-hover table-striped border border-start border-end text-center border-top-0">
                      <thead className="table-dark position-sticky top-0">
                        <tr>
                          <th className="bg-primary text-white align-middle w-25">Captured Tracibility</th>
                          <th className="bg-primary text-white align-middle w-25">Station</th>
                          <th className="bg-primary text-white align-middle w-25">Part Class</th>
                          <th className="bg-primary text-white align-middle w-25">Part Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {genealogyData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.Captured_Tracibility}</td>
                            <td>{item.Station_Name}</td>
                            <td>{item.Part_Class}</td>
                            <td>{item.Part_Number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={closeModal}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          )}
          <AddOperator
            isVisible={isOpModalOpen}
            station={param.station}
            fetchAuditors={fetchAuditors}
            shift={'A'}
            onClose={closeoperatorModal}
          />
          <ConfirmationBox
            title="Confirm"
            visible={confirmationVisible}
            message={`Are you sure to submit All OK?`}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
          <TorqueModal visible={isTorqueModalVisible} onClose={torqueModalClose} torqueData={torqueData} sfc={chassisNumber} />
        </div>

        {/* //==================================================================================== */}

        <div className="container-fluid">
          <div className="d-flex flex-column my-3 " style={{ height: '100vh' }}>
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
              <table
                className="table table-hover table-striped border border-start border-end text-center"
                style={{
                  minWidth: '800px', // Set the minimum height
                }}
              >
                <thead className="position-sticky top-0" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="bg-primary text-white">CHECK POINT</th>
                    <th className="bg-primary text-white">ACTION TAKEN</th>
                    <th className="bg-primary text-white">ADDITIONAL DEFECT</th>
                    <th className="bg-primary text-white">INSP. METHOD</th>
                    <th className="bg-primary text-white">REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {checkPointData.map((checkpoint) => (
                    <tr key={checkpoint.Checkpoint_Id}>
                      <td className="align-middle">{checkpoint.Checkpoint_Name}</td>
                      <td className="align-middle">
                        <div className="d-flex flex-column">
                          <div className="form-check cursor-pointer">
                            <CFormCheck
                              type="radio"
                              id={`radio-ok-${checkpoint.Checkpoint_Id}`} // Unique ID for the radio button
                              name={`checkpoint-${checkpoint.Checkpoint_Id}`} // Ensure the name matches for grouping
                              value="ok"
                              checked={defectStatuses[checkpoint.Checkpoint_Id] === 'ok'}
                              onChange={() => handleStatusChange(checkpoint.Checkpoint_Id, 'ok')}
                              label={<span className="text-success fw-bold">OK</span>}
                            />
                          </div>
                          <div className="form-check cursor-pointer">
                            <CFormCheck
                              type="radio"
                              id={`radio-nok-${checkpoint.Checkpoint_Id}`} // Unique ID for the radio button
                              name={`checkpoint-${checkpoint.Checkpoint_Id}`}
                              value="nok"
                              checked={defectStatuses[checkpoint.Checkpoint_Id] === 'nok'}
                              onChange={() => handleStatusChange(checkpoint.Checkpoint_Id, 'nok', checkpoint.Checkpoint_Name)}
                              label={<span className="text-danger fw-bold">Not OK</span>}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <Select
                          options={defectOptions[checkpoint.Checkpoint_Id] || []} // Use defects for this specific checkpoint
                          placeholder="Select Defects"
                          isClearable
                          isDisabled={defectStatuses[checkpoint.Checkpoint_Id] !== 'nok'} // Disable when status is not "NOK"
                          styles={reactSelectPopupStyles}
                          isMulti
                          onChange={(selectedOption) => handleSelectedDefects(checkpoint.Checkpoint_Id, selectedOption)}
                          value={selectedDefects[checkpoint.Checkpoint_Id] || null} // Select the option based on the selected state
                        />
                      </td>
                      <td className="align-middle">{checkpoint.Inspection_Method}</td>
                      <td className="align-middle">
                        <CFormInput type="text" placeholder="Add Remarks" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkmansheet;
