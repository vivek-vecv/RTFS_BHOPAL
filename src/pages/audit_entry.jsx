import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmationBox from './ConfirmationBox.jsx';
import { CButton, CSpinner, CModal, CModalHeader, CModalBody } from '@coreui/react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BsQrCode } from 'react-icons/bs';
import BarcodeScanner from './BarcodeScanner.jsx';
const AuditEntry = () => {
  const [process, setProcess] = useState('static');
  const [loading, setLoading] = useState(false);
  const [defectStatus, setDefectStatus] = useState('NOK');
  const [dataFetchLoading, setDataFetchLoading] = useState(false);
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
  const [confirmationVisible, setConfirmationVisible] = useState(false);

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
      const response = await axios.get(`http://10.119.1.101:9898/rest/api/getSerialNoDetailsForAudit?Serial_Number=${serialNumber}`, {
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
          Shift_Name: serialInformation.Shift_Name,
          Order_Number: serialInformation.Order_Number,
          Part_Description: serialInformation.Part_Description,
        });

        await fetchPartsData(serialInformation.Series, process);
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

  const fetchPartsData = async (series, processName) => {
    try {
      const response = await axios.get(
        `http://10.119.1.101:9898/rest/api/getPartsForAuditAcctoProcess?Model=${series}&Process_Name=${processName}`,
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
      const selectedPartName = selectedOption.value;
      await fetchDefectsForPart(serialInfo.Series, selectedPartName);
      setSelectedPart(selectedOption);

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
            value: defect.Defect_Name,
            label: defect.Defect_Name,
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
  };

  const handleDefectChange = (selectedOptions) => {
    setSelectedDefects(selectedOptions);
  };

  const handleAdd = async () => {
    if (!selectedPart || selectedDefects.length === 0) {
      toast.warn('Select part or defect(s) to add', { autoClose: 3000 });
      return;
    }

    const model = serialInfo.Series;
    let newDemerits = 0;
    const newEntries = [];

    setLoading(true);
    for (const selectedDefect of selectedDefects) {
      const exists = tableEntries.some((entry) => entry.PART === selectedPart.value && entry.DEFECT_DESC === selectedDefect.value);

      if (exists) {
        toast.error(`Entry already exists for part: ${selectedPart.value} and defect: ${selectedDefect.value}`, { autoClose: 3000 });
        setLoading(false);

        continue;
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
            };

            newEntries.push(tableRow);
            newDemerits += parseInt(info.Demerit) || 0;
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

    setTableEntries((prevEntries) => [...prevEntries, ...newEntries]);
    setTotalDefects((prevTotal) => prevTotal + newEntries.length);
    setTotalDemerits((prevTotal) => prevTotal + newDemerits);
  };

  useEffect(() => {
    fetchAuditors();
  }, []);

  const handleDelete = (index, defectValue, demeritValue) => {
    setTableEntries((prevEntries) => {
      const updatedEntries = prevEntries.filter((_, i) => i !== index);
      return updatedEntries;
    });

    setTotalDefects((prevTotal) => prevTotal - 1);
    setTotalDemerits((prevTotal) => prevTotal - parseInt(demeritValue) || 0);
  };

  //==============================Submit function code ===================================================

  const handleSubmit = async () => {
    if (chassisNumber) {
      if (tableEntries.length === 0) {
        setDefectStatus('All Ok');
        setConfirmationVisible(true);
        return;
      }

      await proceedWithSubmission();
    } else {
      toast.error('Please enter chassis to submit.');
    }
  };

  const proceedWithSubmission = async () => {
    if (!auditDate) {
      toast.error('Please select inspection date and time.');
      return;
    }

    if (!auditorOptions.value) {
      toast.error('Please select auditor name.');
      return;
    }

    try {
      let status;
      if (tableEntries.length === 0) {
        const dataList = {
          Rollout_Date: serialInfo.Rollout_Date,
          Model: serialInfo.Model,
          Category: '',
          Part_Name: '',
          Defect_Code: '',
          Defect_Desc: '',
          Station: 'PAG',
          Demerit: '',
          Tself: '',
          Head: '',
          Aggregate: '',
          Status: defectStatus,
          Audit_Date: auditDate,
        };

        const serialNumber = chassisNumber;
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
      } else {
        setDefectStatus('Not OK');
        for (const entry of tableEntries) {
          const dataList = {
            Rollout_Date: serialInfo.Rollout_Date,
            Model: serialInfo.Model,
            Category: entry.CATEGORY,
            Part_Name: entry.PART,
            Defect_Code: entry.DEFECT_CODE,
            Defect_Desc: entry.DEFECT_DESC,
            Station: 'PDI',
            Demerit: entry.DEMERIT,
            Tself: entry.TSELF,
            Head: entry.HEAD,
            Aggregate: entry.AGGREGATE,
            Status: defectStatus,
            Audit_Date: auditDate,
          };

          const serialNumber = chassisNumber;
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
      zIndex: 10000,
    }),
  };

  const handleScan = (value) => {
    setChassisNumber(value);
    setModalVisible(false);
    fetchChassisNumber(value);
  };
  const handleQrClick = () => {
    setModalVisible(true);
  };
  const handleConfirm = async () => {
    setConfirmationVisible(false);
    await proceedWithSubmission();
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
                Engine Number
              </label>
              <input
                type="text"
                id="engineNumber"
                className="form-control disabled-input"
                value={serialInfo.Engine_Number}
                disabled={true}
              />
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
                Series
              </label>
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Series} disabled={true} />
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
              <input type="text" id="series" className="form-control disabled-input" value={serialInfo.Part_Description} disabled={true} />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-4">
              <label htmlFor="rolloutDate" className="form-label fw-bold m-0">
                Rollout Date
              </label>
              <input type="text" id="rolloutDate" className="form-control disabled-input" value={serialInfo.Rollout_Date} disabled={true} />
            </div>
            <div className="col-12 col-sm-4">
              <label htmlFor="rolloutShift" className="form-label fw-bold m-0">
                Rollout Shift
              </label>
              <input type="text" value={serialInfo.Shift_Name} id="rolloutShift" className="form-control disabled-input" disabled={true} />
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
                Audit Date
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
                Auditor Name
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
        <ConfirmationBox
          title="Confirm"
          visible={confirmationVisible}
          message={`Are you sure to submit All OK?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        {/* 2nd Div: Dropdowns and Add button */}
        <div className="container-fluid">
          <div className="row align-items-center gap-3">
            <div className="col-md-8 d-flex flex-row row">
              <div className="col-12 col-sm-4">
                <label htmlFor="selectPart" className="form-label fw-bold m-0">
                  Select Part
                </label>
                <Select
                  options={partOptions}
                  placeholder="Select part"
                  isClearable
                  styles={reactSelectPopupStyles}
                  onChange={handlePartChange}
                  value={selectedPart ? { value: selectedPart.value, label: selectedPart.label } : null}
                />
              </div>
              <div className="col-12 col-sm-8" style={{ zIndex: 1100 }}>
                <label htmlFor="selectDefects" className="form-label fw-bold m-0">
                  Select Defects
                </label>
                <Select
                  options={defectOptions}
                  placeholder="Select defects"
                  isClearable
                  isMulti
                  value={selectedDefects}
                  onChange={handleDefectChange}
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
          <div className="d-flex flex-column my-3 " style={{ height: '100vh' }}>
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
              <table
                className="table table-striped table-hover table-bordered"
                style={{
                  minWidth: '800px',
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

export default AuditEntry;
