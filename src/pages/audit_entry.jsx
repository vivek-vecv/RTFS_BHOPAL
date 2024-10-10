import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@coreui/react";
import "./audit_entry.css"; // Import the CSS file
import logo from "../images/eicher_logo.png";
import Navbar from "./navbar.jsx";
import ShiftAndTime from "./ShiftAndTime.jsx";
const AuditEntry = () => {
  // const [currentTime, setCurrentTime] = useState(new Date());
  const { currentTime, shift } = ShiftAndTime();
  // const [shift, setShift] = useState("");
  const [process, setProcess] = useState("static");
  const [chassisNumber, setChassisNumber] = useState("");
  const [fullChassisNumber, setFullChassisNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [model, setModel] = useState("");
  const [series, setSeries] = useState("");
  const [shiftOptions, setShiftOptions] = useState([]);
  const [auditorOptions, setAuditorOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [defectOptions, setDefectOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [tableEntries, setTableEntries] = useState([]);
  const [serialInfo, setSerialInfo] = useState({
    Series: "",
    Engine_Number: "",
    Model: "",
    Rollout_Date: "",
    Serial_Number: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
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
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getSerialNoDetailsForAudit/?Serial_Number=${serialNumber}`,
        {
          auth: {
            username: "arun",
            password: "123456",
          },
        }
      );

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
      console.error("Error fetching serial number details:", error);
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
      console.error("Error fetching serial details :", error);
    }
  };

  const fetchPartsData = async (series, processName) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getPartsForAuditAcctoProcess?Model=${series}&2000&Process_Name=${processName}`,
        {
          auth: {
            username: "arun",
            password: "123456",
          },
        }
      );

      if (response.status === 200) {
        const partsList = response.data["Parts Data_List"] || [];
        setPartOptions(
          partsList.map((part) => ({
            PART_ID: part.Part_Name,
            PART_NAME: part.Part_Name,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching parts data:", error);
    }
  };

  const handlePartChange = async (e) => {
    const selectedPartID = e.target.value;

    // Find the selected part to get its name
    const selectedPart = partOptions.find(
      (part) => part.PART_ID === selectedPartID
    );

    if (selectedPart) {
      // Fetch defects for the selected part
      await fetchDefectsForPart(serialInfo.Series, selectedPart.PART_NAME); // Correctly use selectedPart.PART_NAME
    }
  };

  const fetchDefectsForPart = async (seriesName, partName) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getAllDefectsForAuditPart?Model_Name=${seriesName}&Part_name=${partName}`,
        {
          auth: {
            username: "arun",
            password: "123456",
          },
        }
      );
      console.log("API Response:", response.data);
      if (response.status === 200) {
        const defectsList = response.data.Defect_List || [];
        // Map the defects to set the options correctly
        setDefectOptions(
          defectsList.map((defect) => ({
            DEFECT_CODE: defect.Defect_Name, // Using Defect_Name directly
            DEFECT_DESC: defect.Defect_Name, // Using Defect_Name for description as well
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching defects for part:", error);
    }
  };

  /*const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      fetchSerialNumberDetails(chassisNumber);
    }
  };*/

  useEffect(() => {
    if (fullChassisNumber) {
      fetchHeaderData(fullChassisNumber);
    }
  }, [fullChassisNumber]);

  const fetchHeaderData = (fullChassis) => {
    console.log(`Fetching data for chassis: ${fullChassis}`);
    setIsDisabled(false);
    //  fetchPartsData(fullChassis);
  };

  const handleAdd = async () => {
    const selectedPartID = document.getElementById("selectPart").value;
    const selectedDefectCode = document.getElementById("selectDefects").value;

    const selectedPart = partOptions.find(
      (part) => part.PART_ID === selectedPartID
    );
    const selectedDefect = defectOptions.find(
      (defect) => defect.DEFECT_CODE === selectedDefectCode
    );

    if (selectedPart && selectedDefect) {
      const newEntry = {
        part: selectedPart.PART_NAME,
        defect: selectedDefect.DEFECT_DESC,
        model: serialInfo.Series,
      };

      const apiUrl = `http://10.119.1.101:9898/rest/api/getAllDefectsDataForAudit?part_ID=${encodeURIComponent(
        newEntry.part
      )}&Defect_Desc=${encodeURIComponent(
        newEntry.defect
      )}&Model=${encodeURIComponent(newEntry.model)}`;

      try {
        const response = await axios.get(apiUrl, {
          auth: {
            username: "arun",
            password: "123456",
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
              zone: "N/A", // Fallback for zone
            };
            setTableEntries((prevEntries) => {
              const updatedEntries = [...prevEntries, tableRow];
              console.log("Updated Entries:", updatedEntries); // Check updated state
              return updatedEntries;
            });
          });
        }
      } catch (error) {
        console.error("Error fetching defect data:", error);
        alert("Failed to fetch defect data. Please try again."); // User feedback
      }
    } else {
      console.warn("Selected part or defect not found");
    }
  };
  useEffect(() => {
    const fetchAuditors = async () => {
      try {
        const response = await axios.get(
          "http://10.119.1.101:9898/rest/api/getAllAuditors/",
          {
            auth: {
              username: "arun",
              password: "123456",
            },
          }
        );

        if (response.status === 200) {
          const auditorsList = response.data.Auditors_list || [];
          setAuditorOptions(
            auditorsList.map((auditor) => ({ auditor_list: auditor.Auditor }))
          );
        }
      } catch (error) {
        console.error("Error fetching auditors:", error);
      }
    };

    fetchAuditors();
  }, []);

  const filteredParts = partOptions.filter((part) =>
    part.PART_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar
        shift={shift}
        currentTime={currentTime}
        heading={"PDI Defect Entry Screen"}
      />
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
            <input
              type="text"
              id="engineNumber"
              className="input-box disabled-input"
              value={serialInfo.Engine_Number}
              disabled={true}
            />
          </div>
          <div className="div2 div_item">
            <div className="input-row">
              <div>
                <label htmlFor="rolloutDate" className="input-label">
                  Rollout Date
                </label>
                <input
                  type="text"
                  id="rolloutDate"
                  className="input-box disabled-input"
                  value={serialInfo.Rollout_Date}
                  disabled={true}
                />
              </div>
              <div>
                <label htmlFor="rolloutShift" className="input-label">
                  Rollout Shift
                </label>
                <input
                  type="text"
                  id="rolloutShift"
                  className="input-box disabled-input"
                  disabled={true}
                />
              </div>
            </div>
            <div>
              <label htmlFor="model" className="input-label">
                Model
              </label>
              <input
                type="text"
                id="model"
                className="input-box disabled-input"
                value={serialInfo.Model}
                disabled={true}
              />
            </div>
          </div>
          <div className="div3 div_item">
            <div className="input-row">
              <div>
                <label htmlFor="totalDefectCount" className="input-label">
                  Total Defect Count
                </label>
                <input
                  type="text"
                  id="totalDefectCount"
                  className="input-box disabled-input"
                  disabled={true}
                />
              </div>
              <div>
                <label htmlFor="totalDemerit" className="input-label">
                  Total Demerit
                </label>
                <input
                  type="text"
                  id="totalDemerit"
                  className="input-box disabled-input"
                  disabled={true}
                />
              </div>
            </div>
            <div>
              <label htmlFor="series" className="input-label">
                Series
              </label>
              <input
                type="text"
                id="series"
                className="input-box disabled-input"
                value={serialInfo.Series}
                disabled={true}
              />
            </div>
          </div>

          <div className="div4 div_item">
            <div className="input-row1">
              <div className="date-div">
                <label
                  htmlFor="inspectionDate"
                  className="input-label required"
                >
                  Audit Date
                </label>
                <input
                  type="date"
                  id="inspectionDate"
                  className="date-input-box"
                  required
                />
              </div>
            </div>

            <div className="input-row1">
              <div className="inspectorName-div">
                <label
                  htmlFor="inspectorName"
                  className="input-label  required"
                >
                  Auditor Name
                </label>
                <CFormSelect
                  id="inspectorName"
                  className="input-box font-dropdown p-0 px-2"
                  required
                >
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
        <div className="second-section">
          <div className="dropdown-wrapper">
            <label htmlFor="selectPart" className="dropdown-label">
              Select Part
            </label>
            <CFormSelect
              id="selectPart"
              className="dropdown"
              aria-label="Select Part"
              onChange={handlePartChange}
            >
              <option>Select Part</option>
              {partOptions.map((part) => (
                <option key={part.PART_ID} value={part.PART_ID}>
                  {part.PART_NAME}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="dropdown-wrapper">
            <label htmlFor="selectDefects" className="dropdown-label">
              Select Defects
            </label>
            <CFormSelect
              id="selectDefects"
              className="dropdown"
              aria-label="Select Defects"
            >
              <option>Select Defect</option>
              {defectOptions.map((defect, index) => (
                <option key={index} value={defect.DEFECT_CODE}>
                  {defect.DEFECT_DESC}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="button-wrapper">
            <CButton className="add-button" onClick={handleAdd}>
              + Add
            </CButton>
            <CButton className="add-button">Refresh</CButton>
            <CButton className="add-button">Delete</CButton>
            <CButton className="add-button">Submit</CButton>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section">
          <CTable striped hover responsive>
            <CTableHead className="th1">
              <CTableRow>
                <CTableHeaderCell>PART NAME</CTableHeaderCell>
                <CTableHeaderCell>DEFECT DESC</CTableHeaderCell>
                <CTableHeaderCell>DEMERIT</CTableHeaderCell>
                <CTableHeaderCell>TSELF</CTableHeaderCell>
                <CTableHeaderCell>AGGREGATE</CTableHeaderCell>
                <CTableHeaderCell>HEAD</CTableHeaderCell>
                <CTableHeaderCell>CATEGORY</CTableHeaderCell>
                <CTableHeaderCell>ZONE</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {tableEntries.map((row, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{row.PART}</CTableDataCell>
                  <CTableDataCell>{row.DEFECT_DESC}</CTableDataCell>
                  <CTableDataCell>{row.DEMERIT}</CTableDataCell>
                  <CTableDataCell>{row.TSELF}</CTableDataCell>
                  <CTableDataCell>{row.AGGREGATE}</CTableDataCell>
                  <CTableDataCell>{row.HEAD}</CTableDataCell>
                  <CTableDataCell>{row.CATEGORY}</CTableDataCell>
                  <CTableDataCell>{row.zone}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  );
};

export default AuditEntry;
