import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CButton,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CHeaderNav,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import logo from '../images/eicher_logo.png';
import { FaTrash } from 'react-icons/fa';
import Navbar from './navbar.jsx';
import ShiftAndTime from './ShiftAndTime.jsx';
const AuditEntry = () => {
  // const [currentTime, setCurrentTime] = useState(new Date());
  const { currentTime, shift } = ShiftAndTime();
  // const [shift, setShift] = useState("");
  const [process, setProcess] = useState('static');
  const [chassisNumber, setChassisNumber] = useState('');
  const [fullChassisNumber, setFullChassisNumber] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [model, setModel] = useState('');
  const [series, setSeries] = useState('');
  const [shiftOptions, setShiftOptions] = useState([]);
  const [auditorOptions, setAuditorOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [defectOptions, setDefectOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
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
  const [totalDefects, setTotalDefects] = useState(0);
  const [totalDemerits, setTotalDemerits] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   const hour = currentTime.getHours();
  //   if (hour >= 8 && hour < 16) {
  //     setShift("A");
  //   } else if (hour >= 16 && hour < 24) {
  //     setShift("B");
  //   } else {
  //     setShift("C");
  //   }

  //   return () => clearInterval(intervalId);
  // }, [currentTime]);

  // const formatTime = (date) => {
  //   return date.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     hour12: true,
  //   });
  // };

  const fetchSerialNumberDetails = async (serialNumber) => {
    try {
      const response = await axios.get(`http://10.119.1.101:9898/rest/api/getSerialNoDetailsForAudit/?Serial_Number=${serialNumber}`, {
        auth: {
          username: 'arun',
          password: '123456',
        },
      });

      if (response.status === 200) {
        const serialInformation = response.data.Serial_Information[0];
        setSerialInfo({
          Series: serialInformation.Series,
          Engine_Number: serialInformation.Engine_Number,
          Model: serialInformation.Model,
          Rollout_Date: serialInformation.Rollout_Date,
          Serial_Number: serialInformation.Serial_Number,
        });

        await fetchPartsData(serialInformation.Series, process);
        return serialInformation.Serial_Number;
      }
    } catch (error) {
      console.error('Error fetching serial number details:', error);
    }
  };

  const handleChassisNumberChange = async (e) => {
    const value = e.target.value;
    setChassisNumber(value);
    try {
      const fullChassis = await fetchSerialNumberDetails(value);
      if (fullChassis) {
        setChassisNumber(fullChassis);
      }
    } catch (error) {
      console.error('Error fetching serial details :', error);
    }
  };

  const fetchPartsData = async (series, processName) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getPartsForAuditAcctoProcess?Model=${series}&2000&Process_Name=${processName}`,
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
      setSelectedPart(selectedPartName);
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

  useEffect(() => {
    if (fullChassisNumber) {
      fetchHeaderData(fullChassisNumber);
    }
  }, [fullChassisNumber]);

  const fetchHeaderData = (fullChassis) => {
    console.log(`Fetching data for chassis: ${fullChassis}`);
    setIsDisabled(false);
  };

  const handleDefectChange = (selectedOptions) => {
    setSelectedDefects(selectedOptions); // Update state with selected defects
  };

  const handleAdd = async () => {
    if (!selectedPart || selectedDefects.length === 0) {
      console.warn('Selected part or defects not found');
      return;
    }

    const model = serialInfo.Series; // Assuming you want to use this model

    let newDemerits = 0; // Initialize a variable to calculate total demerits
    const newEntries = []; // Store newly added entries

    // Loop through each selected defect
    for (const selectedDefect of selectedDefects) {
      const apiUrl = `http://10.119.1.101:9898/rest/api/getAllDefectsDataForAudit?part_ID=${encodeURIComponent(
        selectedPart
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
              zone: 'N/A', // Fallback for zone
            };

            newEntries.push(tableRow); // Store new entries
            newDemerits += parseInt(info.Demerit) || 0; // Use parseFloat and fallback to 0 if NaN

            setSelectedDefects([]);
          });
        }
      } catch (error) {
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
              auditor_list: auditor.Auditor,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching auditors:', error);
      }
    };

    fetchAuditors();
  }, []);

  const handleDelete = (index, defectValue) => {
    setTableEntries((prevEntries) => {
      const updatedEntries = prevEntries.filter((_, i) => i !== index); // Remove the entry at the specified index
      return updatedEntries;
    });

    // Update total defects and demerits
    setTotalDefects((prevTotal) => prevTotal - 1); // Decrease the defect count by 1
    setTotalDemerits((prevTotal) => prevTotal - parseInt(defectValue) || 0); // Decrease total demerits
  };

  return (
    <>
      <Navbar shift={shift} currentTime={currentTime} heading={'Product audit Defect Entry Screen'} />
      <div>
        {/* 1st Div: 4 divs side by side */}
        <div className="first-section">
          <div className="div1 div_item">
            <label htmlFor="chassisNumber" className="input-label">
              Chassis Number
            </label>
            <input
              type="text"
              id="chassisNumber"
              className="input-box"
              placeholder="Enter Chassis Number"
              value={chassisNumber}
              onChange={handleChassisNumberChange}
            />
            <label htmlFor="engineNumber" className="input-label">
              Engine Number
            </label>
            <input type="text" id="engineNumber" className="input-box disabled-input" value={serialInfo.Engine_Number} disabled={true} />
          </div>
          <div className="div2 div_item">
            <div className="input-row">
              <div>
                <label htmlFor="rolloutDate" className="input-label">
                  Rollout Date
                </label>
                <input type="text" id="rolloutDate" className="input-box disabled-input" value={serialInfo.Rollout_Date} disabled={true} />
              </div>
              <div>
                <label htmlFor="rolloutShift" className="input-label">
                  Rollout Shift
                </label>
                <input type="text" id="rolloutShift" className="input-box disabled-input" disabled={true} />
              </div>
            </div>
            <div>
              <label htmlFor="model" className="input-label">
                Model
              </label>
              <input type="text" id="model" className="input-box disabled-input" value={serialInfo.Model} disabled={true} />
            </div>
          </div>
          <div className="div3 div_item">
            <div className="input-row">
              <div>
                <label htmlFor="totalDefectCount" className="input-label">
                  Total Defects
                </label>
                <input type="text" id="totalDefectCount" className="input-box disabled-input" value={totalDefects} disabled={true} />
              </div>
              <div>
                <label htmlFor="totalDemerit" className="input-label">
                  Total Demerit
                </label>
                <input type="text" id="totalDemerit" className="input-box disabled-input" value={totalDemerits} disabled={true} />
              </div>
            </div>
            <div>
              <label htmlFor="series" className="input-label">
                Series
              </label>
              <input type="text" id="series" className="input-box disabled-input" value={serialInfo.Series} disabled={true} />
            </div>
          </div>

          <div className="div4 div_item">
            <div className="input-row1">
              <div className="date-div">
                <label htmlFor="inspectionDate" className="input-label required">
                  Audit Date
                </label>
                <input type="date" id="inspectionDate" className="date-input-box" required />
              </div>
            </div>

            <div className="input-row1">
              <div className="inspectorName-div">
                <label htmlFor="inspectorName" className="input-label  required">
                  Auditor Name
                </label>
                <CFormSelect id="inspectorName" className="input-box font-dropdown p-0 px-2" required>
                  {auditorOptions.length ? (
                    auditorOptions.map((auditor, index) => (
                      <option key={index} value={auditor.auditor_list}>
                        {auditor.auditor_list}
                      </option>
                    ))
                  ) : (
                    <option>No Auditors Available</option>
                  )}
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>

        <hr />
        {/* 2nd Div: Dropdowns and Add button */}
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-8 d-flex flex-row row">
              <div className="col-4" style={{ zIndex: 1100 }}>
                <label htmlFor="selectPart" className="dropdown-label">
                  Select Part
                </label>
                <Select options={partOptions} placeholder="Select a part" isClearable onChange={handlePartChange} />
              </div>
              <div className="col-8" style={{ zIndex: 1100 }}>
                <label htmlFor="selectDefects" className="dropdown-label">
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
                <CButton className="btn btn-primary" onClick={handleAdd}>
                  + Add
                </CButton>
                <CButton className="btn btn-primary">Refresh</CButton>
                <CButton className="btn btn-success">Submit</CButton>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section position-relative">
          <div
            className="table-responsive"
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <table className="table table-striped table-hover">
              <thead
                className="thead-light"
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#f8f9fa',
                  borderTop: 'none',
                }}
              >
                <tr>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '15%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    PART NAME
                  </th>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '30%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    DEFECT DESC
                  </th>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '8%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    DEMERIT
                  </th>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '20%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    TSELF
                  </th>

                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '20%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    HEAD
                  </th>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '20%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    CATEGORY
                  </th>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '20%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    ZONE
                  </th>
                  <th
                    style={{
                      borderTop: 'none',
                      background: 'var(--cui-primary)',
                      color: 'white',
                      width: '10%',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableEntries.map((row, index) => (
                  <tr key={index}>
                    <td>{row.PART}</td>
                    <td>{row.DEFECT_DESC}</td>
                    <td>{row.DEMERIT}</td>
                    <td>{row.TSELF}</td>
                    <td>{row.HEAD}</td>
                    <td>{row.CATEGORY}</td>
                    <td>{row.zone}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index, row.DEFECT_DESC)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditEntry;
