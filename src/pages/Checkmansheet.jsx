import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CButton, CSpinner, CModal, CModalHeader, CModalBody } from '@coreui/react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BsQrCode } from 'react-icons/bs';
import BarcodeScanner from './BarcodeScanner.jsx';
import { useNavbar } from '../context/NavbarContext.jsx';
const Checkmansheet = () => {
  // const [selectedComponent, setSelectedComponent] = useState(null);
  const [param, setParam] = useState({});
  const [showButtons, setShowButtons] = useState(true); // State to manage button visibility

  const handleButtonClick = (paramValue) => {
    setParam(paramValue);
    setShowButtons(false); // Hide buttons after selection
  };

  const params = [
    { line: 'Chassis', station: 'QG01', direction: 'Left' },
    { line: 'Chassis', station: 'QG01', direction: 'Right' },
    { line: 'Chassis', station: 'QG02', direction: 'Left' },
    { line: 'Chassis', station: 'QG02', direction: 'Right' },
    { line: 'Chassis', station: 'QG03', direction: 'Left' },
    { line: 'Chassis', station: 'QG03', direction: 'Right' },
    { line: 'Cabtrim', station: 'QG01' },
    { line: 'Cabtrim', station: 'QG02' },
    { line: 'Cabtrim', station: 'QG03' },
  ];

  // Categorize params based on line
  const chassisParams = params.filter((item) => item.line === 'Chassis');
  const cabtrimParams = params.filter((item) => item.line === 'Cabtrim');

  return (
    <div className="">
      {showButtons && ( // Render buttons only if showButtons is true
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
  console.log('------------------param-------------------\n', param);
  const { setNavbarData } = useNavbar();
  setNavbarData(param);

  const [process, setProcess] = useState('static');
  const [dataFetchLoading, setDataFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [chassisNumber, setChassisNumber] = useState('');
  const [auditorOptions, setAuditorOptions] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [defectOptions, setDefectOptions] = useState([]);
  const [error, setError] = useState('');
  const [tableEntries, setTableEntries] = useState([]);
  const [serialInfo, setSerialInfo] = useState({
    Series: '',
    Engine_Number: '',
    Model: '',
    Rollout_Date: '',
    Serial_Number: '',
  });
  const [selectedDefects, setSelectedDefects] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [totalDefects, setTotalDefects] = useState(0);
  const [totalDemerits, setTotalDemerits] = useState(0);
  const [auditDate, setAuditDate] = useState('');

  const emptyModel = () => {
    setTotalDefects(0);
    setTotalDemerits(0);
    setChassisNumber('');
    setAuditorOptions([]);
    setPartOptions([]);
    setDefectOptions([]);
    setSelectedPart(null);
    setSelectedAuditor(null);
    setSelectedDefects([]);
    setTableEntries([]);
    setSerialInfo({
      Series: '',
      Engine_Number: '',
      Model: '',
      Rollout_Date: '',
      Serial_Number: '',
      Part_Description: '',
      Order_Number: '',
      Shift_Name: '',
    });
    setSelectedPart(null);
    setAuditDate('');
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
        });

        await fetchPartsData(serialInformation.Serial_Number, serialInformation.Station, serialInformation.Line);
        return serialInformation.Serial_Number;
      }
    } catch (error) {
      console.error('Error fetching serial number details:', error);
    }
  };

  const fetchChassisNumber = async (value) => {
    setDataFetchLoading(true);
    try {
      if (value.length == 6 || value.length == 17) {
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

  const fetchPartsData = async (serialNumber, Station, Line) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getCheckpointList?Serial_Number=${serialNumber}&Line_Name=${Line}&Station_Name=${Station}`,
        {
          auth: {
            username: 'arun',
            password: '123456',
          },
        }
      );

      if (response.status === 200) {
        const partsList = response.data['Parts Data_List'] || [];
        setPartOptions(
          partsList.map((part) => ({
            value: part.Part_Name,
            label: part.Part_Name,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching parts data:', error);
    }
  };

  const handlePartChange = async (selectedOption) => {
    if (selectedOption) {
      const selectedPartName = selectedOption.value; // Get the selected part's name
      await fetchDefectsForPart(serialInfo.Series, selectedPartName);
      setSelectedPart(selectedOption);
      // Reset the selected defects when part changes
      setSelectedDefects([]);
    }
  };

  const fetchDefectsForPart = async (seriesName, partName) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getAllDefectsForAuditPart?Model_Name=${seriesName}&Part_name=${partName}`,
        {
          auth: {
            username: 'arun',
            password: '123456',
          },
        }
      );

      if (response.status === 200) {
        const defectsList = response.data.Defect_List || [];
        setDefectOptions(
          defectsList.map((defect) => ({
            value: defect.Defect_Name, // Using Defect_Name directly
            label: defect.Defect_Name, // Using Defect_Name for description as well
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching defects for part:', error);
    }
  };

  const fetchAuditors = async () => {
    try {
      const response = await axios.get('http://10.119.1.101:9898/rest/api/getAllAuditors/', {
        auth: {
          username: 'arun',
          password: '123456',
        },
      });

      if (response.status === 200) {
        const auditorsList = response.data.Auditors_list || [];
        setAuditorOptions(
          auditorsList.map((auditor) => ({
            value: auditor.Auditor,
            label: auditor.Auditor,
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

  const handleDefectChange = (selectedOptions) => {
    setSelectedDefects(selectedOptions); // Update state with selected defects
  };

  const handleAdd = async () => {
    if (!selectedPart || selectedDefects.length === 0) {
      toast.warn('Select part or defect(s) to add', { autoClose: 3000 });
      return;
    }

    const model = serialInfo.Series; // Assuming you want to use this model
    let newDemerits = 0; // Initialize a variable to calculate total demerits
    const newEntries = []; // Store newly added entries

    // Loop through each selected defect
    setLoading(true);
    for (const selectedDefect of selectedDefects) {
      // Check if the entry already exists
      const exists = tableEntries.some((entry) => entry.PART === selectedPart.value && entry.DEFECT_DESC === selectedDefect.value);

      if (exists) {
        toast.error(`Entry already exists for part: ${selectedPart.value} and defect: ${selectedDefect.value}`, { autoClose: 3000 });
        setLoading(false);

        continue; // Skip this defect if it already exists
      }

      const apiUrl = `http://10.119.1.101:9898/rest/api/getAllDefectsDataForAudit?part_ID=${encodeURIComponent(
        selectedPart.value
      )}&Defect_Desc=${encodeURIComponent(selectedDefect.value)}&Model=${encodeURIComponent(model)}`;

      try {
        const response = await axios.get(apiUrl, {
          auth: {
            username: 'arun',
            password: '123456',
          },
        });

        if (response.status === 200) {
          const defectInfo = response.data.Defect_Information || [];

          defectInfo.forEach((info) => {
            const tableRow = {
              PART: info.Part_Name,
              DEFECT_DESC: info.Defect_Desc,
              DEMERIT: info.Demerit,
              TSELF: info.Tself,
              AGGREGATE: info.Aggregate,
              HEAD: info.Head,
              CATEGORY: info.Category,
              ZONE: 'N/A',
              SFC: chassisNumber,
              STATUS: 'NOK',
              DEFECT_CODE: info.Defect_Code,
              // Fallback for zone
            };

            newEntries.push(tableRow); // Store new entries
            newDemerits += parseInt(info.Demerit) || 0; // Use parseFloat and fallback to 0 if NaN
            setSelectedDefects([]);
          });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching defect data:', error);
        alert('Failed to fetch defect data for ' + selectedDefect.value);
      }
    }

    // Update the table entries and totals after the loop
    setTableEntries((prevEntries) => [...prevEntries, ...newEntries]);
    setTotalDefects((prevTotal) => prevTotal + newEntries.length); // Update total defects
    setTotalDemerits((prevTotal) => prevTotal + newDemerits); // Update total demerits
  };

  useEffect(() => {
    fetchAuditors();
  }, []);

  const handleDelete = (index, defectValue, demeritValue) => {
    setTableEntries((prevEntries) => {
      const updatedEntries = prevEntries.filter((_, i) => i !== index); // Remove the entry at the specified index
      return updatedEntries;
    });

    // Update total defects and demerits
    setTotalDefects((prevTotal) => prevTotal - 1); // Decrease the defect count by 1
    setTotalDemerits((prevTotal) => prevTotal - parseInt(demeritValue) || 0); // Decrease total demerits
  };

  //==============================Submit function code ===================================================

  const handleSubmit = async () => {
    if (tableEntries.length === 0) {
      toast.error('No entries in table.'); // Set error if date is blank
      return;
    }

    if (!auditDate) {
      toast.error('Please select an audit date and time.');
      return; // Exit the function if auditDate is empty
    }

    try {
      let status;
      for (const entry of tableEntries) {
        const dataList = {
          Rollout_Date: serialInfo.Rollout_Date, // Adjust as necessary
          Model: serialInfo.Model, // Adjust as necessary
          Category: entry.CATEGORY,
          Part_Name: entry.PART,
          Defect_Code: entry.DEFECT_CODE, // Replace with actual defect code if available
          Defect_Desc: entry.DEFECT_DESC,
          Station: 'PAG', // Adjust as necessary
          Demerit: entry.DEMERIT,
          Tself: entry.TSELF,
          Head: entry.HEAD,
          Aggregate: entry.AGGREGATE,
          Status: 'NOK', // Adjust as necessary
          Audit_Date: auditDate, // Use the entered audit date
        };

        const serialNumber = chassisNumber; // Adjust as necessary
        setChassisNumber(chassisNumber);
        const apiUrl = `http://10.119.1.101:9898/rest/api/savePDIDefectData?dataList=${encodeURIComponent(
          JSON.stringify(dataList)
        )}&Serial_Number=${serialNumber}`;

        const response = await axios.post(apiUrl, {
          auth: {
            username: 'arun',
            password: '123456',
          },
        });

        if (response.status === 200) {
          status = 200;
          setError('');
        }
      }
      status === 200 ? toast.success(`Data submitted successfully for ${chassisNumber}`) : toast.error('Error submitting data');
      emptyModel();
    } catch (error) {
      console.error('Error submitting data:', error);
      setError('Failed to submit data. Please try again.');
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
            <div className="col-12 col-sm-6 col-md-4">
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
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="engineNumber" className="form-label fw-bold m-0">
                Line
              </label>
              <input type="text" id="engineNumber" className="form-control disabled-input" value={serialInfo.Line} disabled={true} />
            </div>

            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="series" className="form-label fw-bold m-0">
                Order No.
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Order_Number} disabled={true} />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="series" className="form-label fw-bold m-0">
                Station
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Station} disabled={true} />
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="model" className="form-label fw-bold m-0">
                Model
              </label>
              <input type="text" id="model" className="form-control disabled-input" value={serialInfo.Model} disabled={true} />
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="series" className="form-label fw-bold m-0">
                Model Desc
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Model_Desc} disabled={true} />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-4">
              <label htmlFor="rolloutDate" className="form-label fw-bold m-0">
                Halb Code
              </label>
              <input type="text" id="rolloutDate" className="form-control disabled-input" value={serialInfo.Halb_Code} disabled={true} />
            </div>
            <div className="col-12 col-sm-4">
              <label htmlFor="rolloutShift" className="form-label fw-bold m-0">
                Shift
              </label>
              <input type="text" value={serialInfo.Shift} id="rolloutShift" className="form-control disabled-input" disabled={true} />
            </div>
            <div className="col-12 col-sm-2">
              <label htmlFor="totalDefectCount" className="form-label fw-bold m-0">
                Total Defects
              </label>
              <input type="text" id="totalDefectCount" className="form-control disabled-input" value={totalDefects} disabled={true} />
            </div>
            <div className="col-12 col-sm-2">
              <label htmlFor="totalDemerit" className="form-label fw-bold m-0">
                Total Demerit
              </label>
              <input type="text" id="totalDemerit" className="form-control disabled-input" value={totalDemerits} disabled={true} />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-6">
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
            <div className="col-12 col-sm-6">
              <label htmlFor="inspectorName" className="form-label fw-bold m-0">
                Checkman Name
              </label>
              <Select
                options={auditorOptions}
                placeholder="Select auditor"
                isClearable
                styles={reactSelectPopupStyles}
                onChange={handleAuditorChange}
                value={selectedAuditor ? { value: selectedAuditor.value, label: selectedAuditor.label } : null}
              />
            </div>
          </div>
        </div>

        <hr />
        {/* 2nd Div: Dropdowns and Add button */}
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-8 d-flex flex-row row">
              <div className="col-4" style={{ zIndex: 1100 }}>
                <label htmlFor="selectPart" className="form-label fw-bold m-0">
                  Select Part
                </label>
                <Select
                  options={partOptions}
                  placeholder="Select a part"
                  isClearable
                  onChange={handlePartChange}
                  value={selectedPart ? { value: selectedPart.value, label: selectedPart.label } : null}
                />
              </div>
              <div className="col-8" style={{ zIndex: 1100 }}>
                <label htmlFor="selectDefects" className="form-label fw-bold m-0">
                  Select Defects
                </label>
                <Select
                  options={defectOptions}
                  placeholder="Select defects"
                  isClearable
                  isMulti
                  value={selectedDefects} // Bind the selected defects to the component
                  onChange={handleDefectChange} // Set the onChange prop
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-end gap-2  flex-wrap">
                <CButton className="btn btn-primary fw-bold" onClick={handleAdd} disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : '+ Add'}
                </CButton>
                <CButton className="btn btn-primary fw-bold" onClick={emptyModel}>
                  Reset
                </CButton>
                <CButton className="btn btn-success text-white fw-bold" onClick={handleSubmit}>
                  Submit
                </CButton>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {tableEntries.length > 0 && (
          // <div className=" my-4 table-section" style={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }}>
          <div className="d-flex flex-column my-3 " style={{ height: '100vh' }}>
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
              <table
                className="table table-striped table-hover table-bordered"
                style={{
                  // minHeight: '200px',
                  minWidth: '800px', // Set the minimum height
                  // maxHeight: 'none', // No maximum height limit
                  // overflowY: 'auto', // Enable vertical scrolling
                  // overflowX: 'auto', // Enable horizontal scrolling
                }}
              >
                <thead className="position-sticky top-0" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="bg-dark text-light text-center align-middle" scope="col" style={{ minWidth: '7rem' }}>
                      PART NAME
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col" style={{ minWidth: '20rem' }}>
                      DEFECT DESC
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col" style={{ width: '6rem' }}>
                      DEMERIT
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col" style={{ width: '5rem' }}>
                      TSELF
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col">
                      HEAD
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col">
                      CATEGORY
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col">
                      ZONE
                    </th>
                    <th className="bg-dark text-light text-center align-middle" scope="col" style={{ width: '5rem' }}>
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableEntries.map((row, index) => (
                    <tr key={index}>
                      <td className="text-center align-middle">{row.PART}</td>
                      <td className="text-center align-middle">{row.DEFECT_DESC}</td>
                      <td className="text-center align-middle">{row.DEMERIT}</td>
                      <td className="text-center align-middle">{row.TSELF}</td>
                      <td className="text-center align-middle">{row.HEAD}</td>
                      <td className="text-center align-middle">{row.CATEGORY}</td>
                      <td className="text-center align-middle">{row.ZONE}</td>
                      <td className="text-center align-middle">
                        <FaTrash
                          style={{ cursor: 'pointer' }}
                          size={25}
                          color="red"
                          onClick={() => handleDelete(index, row.DEFECT_DESC, row.DEMERIT)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkmansheet;
