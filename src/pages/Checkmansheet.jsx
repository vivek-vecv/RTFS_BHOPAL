import React, { useState, useEffect, useRef } from "react";
import {
  CFormInput,
  CNavbar,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CTableDataCell,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTable,
  CFormCheck,
  CTableHead,
  CContainer,
  CFormSelect,
  CNavbarBrand,
  CRow,
  CCol,
  CCollapse,
  CCard,
  CButton,
  CFormLabel,
  CCardBody,
} from "@coreui/react";
import logo from "../images/eicher_logo.png";
import Navbar from "./navbar.jsx";
import "./Checkmansheet.css"; // Custom CSS for styling
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ShiftAndTime from "./ShiftAndTime.jsx";
import { FaCalendarAlt } from "react-icons/fa";
const Checkmansheet = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [fullChassisNumber, setFullChassisNumber] = useState("");
  const [headerDetails, setHeaderDetails] = useState({});
  const [tableDetails, setTableDetails] = useState([]);
  const [defectList, setDefectList] = useState([]);
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(null);
  const [selectedCheckman, setSelectedCheckman] = useState("");
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // To manage which dropdown is open
  const [selectedDefects, setSelectedDefects] = useState({});
  const { currentTime, shift } = ShiftAndTime();
  const dropdownRefs = useRef([]);
  const fetchData = (inputSerialNumber) => {
    const jsonData = {
      // Include the JSON data here
      six_digit_sfc_input: {
        SFC: "103744",
      },
      six_digit_sfc_output: {
        VIN_NUMBER: ["MC2BAGRC0RA106883", "MC2CBMRC0RC106883"],
      },
      header_details_input: {
        SFC: "MC2CAMRC0RB103744",
        Line: "LMD",
        Zone: "Zone-2",
        LOGGED_STATION: "LMD_QG",
        STATION: "LH",
      },
      header_details_output: {
        CHASSIS_QG_CHECKPOINT: {
          HEADER_DETAILS: {
            SFC: "MC2CAMRC0RB103744",
            LINE: "LMD",
            SHIFT: "A",
            FUELTYPE: "DSL",
            REVISION_NUMBER: 1,
            REVISION_DATE: "30-09-2021",
            FORMAT_NUMBER: "F-QUA-448",
            DATE: "19-09-2024",
            MODEL: "Pro3019",
            MODEL_DESC: "Pro3019/M/SLP/CBC/22FT/BS6 BASE 7S/OBD2",
            FERT_CODE: 99206152,
            HALB_CODE: "CL3986CW",
            CHECKMAN_NAME_LIST: {
              CHECKMAN_NAME: [
                {
                  CHECKMAN_NAME: "Bharat Singh",
                  SEL_NAME: "Rajkumar Ahirwal",
                },
                {
                  CHECKMAN_NAME: "Sur Singh",
                  SEL_NAME: "Rajkumar Ahirwal",
                },
              ],
            },
            REWORKMAN_NAME_LIST: "",
            SEL_CHKMAN: "Rajkumar Ahirwal",
            STATION: "LH",
            SEL_RWKMAN: "Deepak",
          },
          CHECKPOINT_TABLE_DETAILS: {
            CHECKPOINT_TABLE: [
              {
                CHECKPOINT: "No. Punching and Front harness.",
                CHECKPOINT_ID: 25,
                IMAGE_ICON: "",
                INSPECTION_METHOD: "Hand / Visual",
                SEL_ADD: "",
                SEL_STATUS: "",
                REMARKS: "",
                ADDITIONAL_DEFECT_LIST: {
                  DEFECT_DESC: "",
                  DEFECT_CODE: "",
                  ADDITIONAL_DEFECT_DETAILS: [
                    {
                      DEFECT_DESC:
                        "No. Punching and Front harness.- Grinding Mark",
                      DEFECT_CODE: 303102,
                    },
                    {
                      DEFECT_DESC:
                        "No. Punching and Front harness.-Chassis no. wrong",
                      DEFECT_CODE: 303098,
                    },
                    {
                      DEFECT_DESC:
                        "No. Punching and Front harness.-Inclined punching",
                      DEFECT_CODE: 303103,
                    },
                    {
                      DEFECT_DESC:
                        "No. Punching and Front harness.-Letter distance unequal",
                      DEFECT_CODE: 303101,
                    },
                    {
                      DEFECT_DESC:
                        "No. Punching and Front harness.-RPO oil not applied",
                      DEFECT_CODE: 303100,
                    },
                    {
                      DEFECT_DESC:
                        "No. Punching and Front harness.-tracing not ok",
                      DEFECT_CODE: 303099,
                    },
                  ],
                },
              },
              {
                CHECKPOINT: "Rear Suspension Check.",
                CHECKPOINT_ID: 26,
                INSPECTION_METHOD: "Visual Inspection",
                REMARKS: "",
                ADDITIONAL_DEFECT_LIST: {
                  ADDITIONAL_DEFECT_DETAILS: [
                    {
                      DEFECT_DESC: "Loose bolts on suspension.",
                      DEFECT_CODE: 303201,
                    },
                    {
                      DEFECT_DESC: "Deteriorated bushings.",
                      DEFECT_CODE: 303202,
                    },
                  ],
                },
              },
              {
                CHECKPOINT: "Brake System Inspection.",
                CHECKPOINT_ID: 27,
                INSPECTION_METHOD: "Hand / Visual",
                REMARKS: "",
                ADDITIONAL_DEFECT_LIST: {
                  ADDITIONAL_DEFECT_DETAILS: [
                    {
                      DEFECT_DESC: "Brake pads worn out.",
                      DEFECT_CODE: 303301,
                    },
                    {
                      DEFECT_DESC: "Brake fluid leak.",
                      DEFECT_CODE: 303302,
                    },
                  ],
                },
              },
            ],
          },
        },
        post_payload_input: {
          DefectInputString: "303103,NOK;338848,NOK",
          SFC: "MC2CAMRC0RB103744",
          CHECKMAN: "Rajkumar Ahirwal",
          REWORKMAN: "Deepak",
          LOGGED_STATION: "LMD_QG",
          Line: "LMD",
          Zone: "Zone-2",
          Model: "Pro3019",
          STATION: "LH",
        },
        post_payload_output: {
          Status: "Success",
          Message: "Defects saved successfully.",
        },
      },
    };
    // Set the full chassis number here
    const vinNumbers = jsonData.six_digit_sfc_output.VIN_NUMBER || [];
    const fullChassis = vinNumbers.find((vin) =>
      vin.includes(inputSerialNumber)
    );
    setFullChassisNumber(fullChassis || ""); // Set the full chassis number if found
    // Check if serial number matches and set data
    setHeaderDetails(
      jsonData.header_details_output.CHASSIS_QG_CHECKPOINT.HEADER_DETAILS
    );
    setTableDetails(
      jsonData.header_details_output.CHASSIS_QG_CHECKPOINT
        .CHECKPOINT_TABLE_DETAILS.CHECKPOINT_TABLE
    );
    setDefectList(
      jsonData.header_details_output.CHASSIS_QG_CHECKPOINT
        .CHECKPOINT_TABLE_DETAILS.CHECKPOINT_TABLE[0].ADDITIONAL_DEFECT_LIST
        .ADDITIONAL_DEFECT_DETAILS
    );
    setRows(
      jsonData.header_details_output.CHASSIS_QG_CHECKPOINT.CHECKPOINT_TABLE_DETAILS.CHECKPOINT_TABLE.map(
        () => ({ status: "OK", defect: "", remarks: "" })
      )
    );
    setFullChassisNumber(fullChassis || "");
    if (fullChassis) {
      setSerialNumber(fullChassis); // Replace the 6-digit number with the full chassis number
    }
    setDataFetched(true);
  };
  const checkmanNames = headerDetails.CHECKMAN_NAME_LIST?.CHECKMAN_NAME || [];
  const handleSerialChange = (e) => {
    const value = e.target.value;
    setSerialNumber(value);
  };
  const handleDefectSelect = (index, defectDesc) => {
    // Add the selected defect if it's not already included
    setRows((prevRows) => {
      const updatedDefects = [...prevRows[index].defect];
      if (!updatedDefects.includes(defectDesc)) {
        updatedDefects.push(defectDesc);
      } else {
        const idx = updatedDefects.indexOf(defectDesc);
        updatedDefects.splice(idx, 1); // Remove defect if already selected
      }
      return prevRows.map((row, i) =>
        i === index ? { ...row, defect: updatedDefects } : row
      );
    });
  };
  const toggleDropdown = (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null); // Close if the same dropdown is clicked
    } else {
      setDropdownOpen(index); // Open the clicked dropdown
    }
  };
  const handleOutsideClick = (e) => {
    // Close the dropdown if clicked outside of any dropdown
    if (
      dropdownOpen !== null &&
      dropdownRefs.current[dropdownOpen] &&
      !dropdownRefs.current[dropdownOpen].contains(e.target)
    ) {
      setDropdownOpen(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick); // Cleanup on unmount
    };
  }, [dropdownOpen]);
  const handleSerialSubmit = () => {
    if (serialNumber.length === 6) {
      fetchData(serialNumber);
    } else {
      alert("Please enter a valid 6-digit serial number.");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSerialSubmit();
    }
  };
  const handleCheckmanChange = (e) => {
    setSelectedCheckman(e.target.value);
  };
  const handleSuggestionClick = (serial) => {
    setSerialNumber(serial);
    fetchData(serial);
  };
  const handleToggle = (index) => {
    setRows(
      rows.map((row, i) =>
        i === index
          ? { ...row, status: row.status === "OK" ? "NOK" : "OK", defect: "" }
          : row
      )
    );
  };
  const toggleDatePicker = () => {
    setDatePickerOpen(!isDatePickerOpen);
  };
  const handleDefectChange = (index, event) => {
    setRows(
      rows.map((row, i) =>
        i === index ? { ...row, defect: event.target.value } : row
      )
    );
  };
  const handleRemarksChange = (index, event) => {
    setRows(
      rows.map((row, i) =>
        i === index ? { ...row, remarks: event.target.value } : row
      )
    );
  };
  const [data, setData] = useState(["1", "2", "3", "4"]); // Replace with actual serial numbers or observation data
  const handleSubmit = () => {
    const postData = {
      SFC: headerDetails.SFC,
      Line: headerDetails.LINE,
      Defects: rows.map((row) => ({
        defect: row.defect,
        remarks: row.remarks,
      })),
    };
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      });
  };
  return (
    <CContainer fluid>
      <Navbar
        shift={shift}
        currentTime={currentTime}
        heading={"QG Defect Entry Screen Zone - 1"}
      />
      <div className="container-wrapper">
        {/* Container 1 */}
        <div className="box-container box1">
          <div className="input-group">
            <div className="input-item">
              <CFormLabel className="input-label ">Chassis Number</CFormLabel>
              <CFormInput
                value={headerDetails.SFC}
                className="input-box w-auto"
                onChange={handleSerialChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter 6-digit Chassis Number"
              />
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">Shift</CFormLabel>
              <CFormInput
                value={headerDetails.SHIFT || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">Fuel Type</CFormLabel>
              <CFormInput
                value={headerDetails.FUELTYPE || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">Model</CFormLabel>
              <CFormInput
                value={headerDetails.MODEL || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
            <div className="input-item">
              {" "}
              <CFormLabel className="input-label">Line</CFormLabel>
              <CFormInput
                value={headerDetails.LINE || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">Model Description</CFormLabel>
              <CFormInput
                value={headerDetails.MODEL_DESC || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-item">
              <CFormLabel className="input-label">Fert Code</CFormLabel>
              <CFormInput
                value={headerDetails.MODEL_DESC || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">Halb Code</CFormLabel>
              <CFormInput
                value={headerDetails.MODEL_DESC || ""}
                readOnly
                className="input-box disabled-look"
              />
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">Date</CFormLabel>
              <div style={{ position: "relative" }}>
                <CFormInput
                  className="input-box disabled-look"
                  readOnly
                  value={date ? date.toLocaleDateString() : ""}
                  onClick={toggleDatePicker}
                />
                <FaCalendarAlt
                  onClick={toggleDatePicker}
                  readOnly
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    paddingBottom: "0.7rem",
                    cursor: "pointer",
                    color: "black",
                  }}
                />
                {isDatePickerOpen && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      paddingRight: "15px",
                    }}
                  >
                    <DatePicker
                      selected={date}
                      onChange={(date) => {
                        setDate(date);
                        setDatePickerOpen(false);
                      }}
                      onClickOutside={() => setDatePickerOpen(false)}
                      inline
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="input-item">
              <CFormLabel className="input-label">
                Check Man
                <span style={{ color: "red", marginLeft: "0px" }}>*</span>
              </CFormLabel>
              <CFormSelect
                className="input-box"
                value={selectedCheckman}
                onChange={handleCheckmanChange}
              >
                <option value="" disabled>
                  Select Name
                </option>
                {checkmanNames.map((checkman, index) => (
                  <option key={index} value={checkman.CHECKMAN_NAME}>
                    {checkman.SEL_NAME}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="input-item">
              <CFormLabel className="input-label">
                Rework Man
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </CFormLabel>
              <CFormInput className="input-box" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-wrapper1">
        <CRow className="mt-4 d-flex align-items-center ">
          {/* Left container with heading and search input */}
          <CCol
            md="8"
            className="d-flex align-items-center checkpoint-container "
          >
            <CFormLabel className="input-label mx-5">
              Search checkpoints
            </CFormLabel>
            <CFormInput
              value={headerDetails.SHIFT || ""}
              readOnly
              className="input-box w-30"
            />
            <CButton color="primary" className="search-button me-2">
              Search
            </CButton>
          </CCol>
          {/* Right container with buttons */}
          <CCol md="4" className="button-container d-flex justify-content-end">
            <CButton color="primary" className="me-2">
              Refresh
            </CButton>
            <CButton color="success" className="me-2">
              Save as Draft
            </CButton>
            <CButton onClick={handleSubmit} color="danger">
              Submit
            </CButton>
          </CCol>
        </CRow>
      </div>
      <div className="posttable-container">
        <CCard>
          <CCardBody>
            <div className="posttable-wrapper">
              <CTable hover>
                <CTableHead className="th">
                  <CTableRow>
                    <CTableHeaderCell scope="col">CHECK POINT</CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      ACTION TAKEN
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      ADDITIONAL DEFECT
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      INSP. METHOD
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">REMARKS</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableDetails.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{item.CHECKPOINT}</CTableDataCell>
                      {/* Toggle Button for OK/NOK */}
                      <CTableDataCell>
                        <button
                          className={`toggle-button ${
                            rows[index].status === "OK" ? "ok" : "nok"
                          }`}
                          onClick={() => handleToggle(index)}
                        >
                          {rows[index].status}
                        </button>
                      </CTableDataCell>
                      {/* Defect Dropdown */}
                      <CTableDataCell>
                        <div
                          className="dropdown-container"
                          style={{ position: "relative" }}
                          ref={(el) => (dropdownRefs.current[index] = el)}
                        >
                          <button
                            onClick={() => toggleDropdown(index)}
                            className="dropdown-button"
                            disabled={rows[index].status === "OK"}
                          >
                            Select Defects <span className="down-arrow">▼</span>
                          </button>
                          {dropdownOpen === index && (
                            <div
                              className="dropdown-menu"
                              style={{
                                width: "400px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                position: "absolute",
                                zIndex: 1000,
                                backgroundColor: "#fff",
                                top: "100%",
                                left: "0",
                              }}
                            >
                              {defectList.map((defect, defectIndex) => (
                                <div
                                  key={defectIndex}
                                  style={{
                                    width: "100%",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <CFormCheck
                                    key={defectIndex}
                                    type="checkbox"
                                    label={defect.DEFECT_DESC}
                                    checked={rows[index].defect.includes(
                                      defect.DEFECT_DESC
                                    )}
                                    onChange={() =>
                                      handleDefectSelect(
                                        index,
                                        defect.DEFECT_DESC
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                      {/* Inspection Method */}
                      <CTableDataCell>{item.INSPECTION_METHOD}</CTableDataCell>
                      {/* Remarks Input */}
                      <CTableDataCell>
                        <CFormInput
                          value={rows[index].remarks}
                          onChange={(e) => handleRemarksChange(index, e)}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </div>
      <CTable className="observations-table" striped>
        <CTableHead className="observations-header">
          <CTableRow>
            <CTableHeaderCell>SERIAL NUMBER</CTableHeaderCell>
            <CTableHeaderCell>OBSERVATIONS</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((serial) => (
            <CTableRow key={serial}>
              <CTableDataCell>{serial}</CTableDataCell>
              <CTableDataCell>
                <input type="text" className="observation-input" />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );
};
export default Checkmansheet;
