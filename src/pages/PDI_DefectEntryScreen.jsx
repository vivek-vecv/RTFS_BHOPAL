import React, { useState, useEffect } from "react";
import {
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CFormLabel,
  CFormInput,
  CNavLink,
  CButton,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import axios from "axios";
import "./PDI_DefectEntryScreen.css"; // Import the CSS file
import logo from "../images/eicher_logo.png";
import Navbar from "./navbar.jsx";
import ShiftAndTime from "./ShiftAndTime.jsx";

const PDI_DefectEntryScreen = () => {
  const { currentTime, shift } = ShiftAndTime();
  const [chassisNumber, setChassisNumber] = useState("");
  const [fullChassisNumber, setFullChassisNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [model, setModel] = useState("");
  const [series, setSeries] = useState("");
  const [rolloutDate, setRolloutDate] = useState("");
  const [shiftOptions, setShiftOptions] = useState([]);
  const [auditorOptions, setAuditorOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [defectOptions, setDefectOptions] = useState([]);
  const processName = "Static";
  const [isDisabled, setIsDisabled] = useState(true);
  const [tableEntries, setTableEntries] = useState([]);

  const apiUrl = "http://10.119.1.101:9898/rest/api/getSerialNoDetailsForPDI";
  const inspectorApiUrl =
    "http://10.119.1.101:9898/rest/api/getAllInspectorsForPDI";
  const partApiUrl =
    "http://10.119.1.101:9898/rest/api/getPartsForPDIAcctoProcess";

  const defectApiUrl =
    "http://10.119.1.101:9898/rest/api/getAllDefectsForPDIPart";
  const handleChassisNumberChange = (e) => {
    const chassisValue = e.target.value;
    setChassisNumber(chassisValue);

    console.log(chassisValue);

    // Trigger API call when chassis number reaches full length (adjust the length as per your requirement)
    if (chassisValue.length > 4) {
      fetchChassisDetails(chassisValue);
    }
  };

  const fetchChassisDetails = async (chassisNumber) => {
    try {
      const response = await axios.get(
        `${apiUrl}?Serial_Number=${chassisNumber}`
      );
      // Assuming response format matches the one you provided
      const serialInfo = response.data.Serial_Information[0];

      // Populate form fields with the data
      setEngineNumber(serialInfo.Engine_Number);
      setModel(serialInfo.Model);
      setSeries(serialInfo.Series);
      setRolloutDate(serialInfo.Rollout_Date);
      const model = response.data.Serial_Information[0].Series; // Extract model from the chassis API response
      setModel(model); // Store the model in state

      // Fetch part options using the retrieved model
      fetchPartOptions(model);
      // Enable the disabled inputs
      setIsDisabled(false);
      fetchInspectorList();
    } catch (error) {
      console.error("Error fetching chassis details:", error);
    }
  };

  const fetchInspectorList = async () => {
    try {
      const response = await axios.get(inspectorApiUrl);

      // Extract the 'Inspector_list' from the API response
      const inspectorList = response.data.Inspector_list.map(
        (item) => item.Inspector
      );

      setAuditorOptions(inspectorList); // Set the list of inspectors
    } catch (error) {
      console.error("Error fetching inspector list:", error);
      setAuditorOptions([]); // Ensure it remains an array on error
    }
  };

  const fetchPartOptions = async (model) => {
    try {
      const response = await axios.get(
        `${partApiUrl}?Model_Name=${model}&Process_Name=${processName}`
      );

      console.log("parts response", response.data); // Check the response structure

      // Access the "Parts Data_List" array and map the part names
      setPartOptions(response.data["Parts Data_List"]); // Adjust based on the actual key
    } catch (error) {
      console.error(
        "Error fetching part options:",
        error.response?.data || error.message
      );
      setPartOptions([]); // Clear options in case of error
    }
  };

  const handlePartChange = (e) => {
    const selectedPartValue = e.target.value;
    setSelectedPart(selectedPartValue);
    fetchDefectsForPart(selectedPartValue);
  };

  const fetchDefectsForPart = async (part) => {
    try {
      const response = await axios.get(
        `${defectApiUrl}?Model_Name=${model}&Part_name=${part}`
      );
      setDefectOptions(response.data.Defect_List);
    } catch (error) {
      setDefectOptions([]);
    }
  };

  return (
    <div>
      <Navbar
        shift={shift}
        currentTime={currentTime}
        heading={"PDI Defect Entry Screen"}
      />

      {/* 1st Div: 4 divs side by side */}
      <div className="first-section">
        <div className="div1 div_item">
          <CFormLabel htmlFor="chassisNumber" className="input-label">
            Chassis Number
          </CFormLabel>
          <CFormInput
            type="text"
            id="chassisNumber"
            className="input-box"
            placeholder="Enter Chassis Number"
            value={chassisNumber}
            onChange={handleChassisNumberChange}
          />

          <CFormLabel htmlFor="engineNumber" className="input-label">
            Engine Number
          </CFormLabel>
          <CFormInput
            type="text"
            id="engineNumber"
            value={engineNumber}
            disabled
            className="input-box disabled-input"
          />
        </div>
        <div className="div2 div_item">
          <div className="input-row">
            <div>
              <CFormLabel htmlFor="rolloutDate" className="input-label">
                Rollout Date
              </CFormLabel>
              <CFormInput
                type="text"
                id="rolloutDate"
                className="input-box  disabled-input"
                value={rolloutDate}
                disabled={true}
              />
            </div>
            <div>
              <CFormLabel htmlFor="rolloutShift" className="input-label">
                Rollout Shift
              </CFormLabel>
              <CFormInput
                type="text"
                id="rolloutShift"
                className="input-box  disabled-input"
                disabled={true}
              />
            </div>
          </div>
          <div>
            <CFormLabel htmlFor="model" className="input-label">
              Model
            </CFormLabel>
            <CFormInput
              type="text"
              id="model"
              className="input-box  disabled-input"
              value={model}
              disabled={true}
            />
          </div>
        </div>
        <div className="div3 div_item">
          <div className="input-row">
            <div>
              <CFormLabel htmlFor="totalDefectCount" className="input-label  ">
                Total Defect Count
              </CFormLabel>
              <CFormInput
                type="text"
                id="totalDefectCount"
                className="input-box  disabled-input"
                disabled={true}
              />
            </div>
            <div>
              <CFormLabel htmlFor="totalDemerit" className="input-label">
                Total Demerit
              </CFormLabel>
              <CFormInput
                type="text"
                id="totalDemerit"
                className="input-box disabled-input"
                disabled={true}
              />
            </div>
          </div>
          <div>
            <CFormLabel htmlFor="series" className="input-label">
              Series
            </CFormLabel>
            <CFormInput
              type="text"
              id="series"
              className="input-box disabled-input"
              value={series}
              disabled={true}
            />
          </div>
        </div>

        <div className="div4 div_item">
          <div className="input-row1">
            <div className="date-div">
              <CFormLabel
                htmlFor="inspectionDate"
                className="input-label required"
              >
                Inspection Date
              </CFormLabel>
              <CFormInput
                type="date"
                id="inspectionDate"
                className="date-input-box"
                required
              />
            </div>
            <div className="shift-div">
              <CFormLabel
                htmlFor="inspectionShift"
                className="input-label required"
              >
                Inspection Shift
              </CFormLabel>
              <CFormSelect
                id="inspectionShift"
                className="input-box font-dropdown"
                required
              >
                {shiftOptions.map((shift, index) => (
                  <option key={index}>{shift.SHIFT_NAME}</option>
                ))}
              </CFormSelect>
            </div>
          </div>

          <div className="input-row1">
            <div className="inspectorName-div">
              <CFormLabel
                htmlFor="inspectorName"
                className="input-label required"
              >
                Inspector Name
              </CFormLabel>
              <CFormSelect
                id="inspectorName"
                className=" input-box font-dropdown p-0 px-2"
                required
              >
                <option>Select Inspector</option>
                {auditorOptions.length > 0 ? (
                  auditorOptions.map((inspector, index) => (
                    <option key={index} value={inspector}>
                      {inspector}
                    </option>
                  ))
                ) : (
                  <option disabled>No Inspectors Available</option>
                )}
              </CFormSelect>
            </div>
            <div className="dataOperator-div">
              <CFormLabel
                htmlFor="dataEntryOperator"
                className="input-label required"
              >
                Entry Operator
              </CFormLabel>
              <CFormSelect
                id="dataEntryOperator"
                className=" input-box font-dropdown"
                required
              >
                {operatorOptions.map((operator, index) => (
                  <option key={index}>{operator.OPERATOR_LIST}</option>
                ))}
              </CFormSelect>
            </div>
          </div>
        </div>
      </div>

      <hr />
      {/* 2nd Div: Dropdowns and Add button */}
      <div className="second-section d-flex justify-content-start">
        <div className="dropdown-wrapper">
          <CFormLabel htmlFor="selectPart" className="dropdown-label">
            Select Part
          </CFormLabel>
          <CFormSelect
            id="selectPart"
            className="dropdown"
            aria-label="Select Part"
          >
            <option>Select Part</option>
            {Array.isArray(partOptions) && partOptions.length > 0 ? (
              partOptions.map((part, index) => (
                <option key={index} value={index}>
                  {part.Part_Name}
                </option>
              ))
            ) : (
              <option disabled>No Parts Available</option>
            )}
          </CFormSelect>
        </div>
        <div className="dropdown-wrapper">
          <CFormLabel htmlFor="selectDefects" className="dropdown-label">
            Select Defects
          </CFormLabel>
          <CFormSelect
            id="selectDefects"
            className="dropdown"
            aria-label="Select Defects"
          >
            <option>Select Defect</option>
            {Array.isArray(defectOptions) && defectOptions.length > 0 ? (
              defectOptions.map((defect, index) => (
                <option key={index} value={defect.DEFECT_Name}>
                  {defect.DEFECT_DESC || defect.Defect_Name}
                </option>
              ))
            ) : (
              <option disabled>No Defects Available</option>
            )}
          </CFormSelect>
        </div>
        <CButton className="add-button">Add</CButton>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <CTable hover striped bordered>
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
                <CTableDataCell>{row.part}</CTableDataCell>
                <CTableDataCell>{row.defect}</CTableDataCell>
                <CTableDataCell>{row.demerit}</CTableDataCell>
                <CTableDataCell>{row.tself}</CTableDataCell>
                <CTableDataCell>{row.aggregate}</CTableDataCell>
                <CTableDataCell>{row.head}</CTableDataCell>
                <CTableDataCell>{row.category}</CTableDataCell>
                <CTableDataCell>{row.zone}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
};

export default PDI_DefectEntryScreen;
