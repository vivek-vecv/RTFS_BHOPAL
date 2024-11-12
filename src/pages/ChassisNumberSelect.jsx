import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { BsQrCode } from 'react-icons/bs';
import { CModal, CModalBody, CModalHeader } from '@coreui/react';
import BarcodeScanner from './BarcodeScanner.jsx';

const ChassisNumberSelect = ({ chassisNumber, setChassisNumber, fetchSerialNumberDetails, resetSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to reset the select box
  useEffect(() => {
    if (resetSelect) {
      setSelectedOption(null); // Reset AsyncSelect's selected option
    }
  }, [resetSelect]);

  // API call to fetch matching chassis numbers based on the typed or scanned value
  const fetchChassisNumbers = async (inputValue) => {
    try {
      const response = await axios.get(`http://10.119.1.101:9898/rest/api/getAvailableSerialNoForPR?Serial_Number=${inputValue}`, {
        auth: {
          username: 'arun',
          password: '123456',
        },
      });

      // Return the fetched chassis numbers in the format required by AsyncSelect
      return response.data.serialNo_List.map((chassis) => ({
        label: chassis.serialNo, // Displayed in the dropdown
        value: chassis.serialNo, // Used internally when selected
      }));
    } catch (error) {
      console.error('Error fetching chassis data:', error);
      return [];
    }
  };

  // Function to load options as the user types
  const loadOptions = (inputValue, callback) => {
    if (inputValue.length >= 6) {
      fetchChassisNumbers(inputValue).then((options) => {
        callback(options);
      });
    } else {
      callback([]);
    }
  };

  // When an option (chassis number) is selected
  const handleChange = async (option) => {
    setSelectedOption(option);
    if (option?.value) {
      // Fetch serial number details for the selected chassis number
      setChassisNumber(option.value);
      await fetchSerialNumberDetails(option.value);
    }
  };

  // Handle scanned value
  const handleScan = async (value) => {
    setModalVisible(false);
    const options = await fetchChassisNumbers(value);
    if (options.length > 0) {
      const scannedOption = options.find((option) => option.value === value);
      setSelectedOption(scannedOption);
      setChassisNumber(scannedOption.value); // Select the scanned value
      await fetchSerialNumberDetails(scannedOption.value); // Fetch details based on scanned value
    }
  };

  const handleQrClick = () => {
    setModalVisible(true);
  };

  return (
    <div className="input-group">
      <AsyncSelect
        cacheOptions
        className="form-control p-0"
        loadOptions={loadOptions}
        onChange={handleChange}
        isClearable
        value={selectedOption}
        defaultOptions={false}
        noOptionsMessage={() => 'Type at least last 6 characters to search'}
        placeholder="Enter Serial num"
        filterOption={() => true} // Prevents local filtering so only API results show
      />
      <BsQrCode
        className="input-group-text p-1"
        size={40}
        onClick={handleQrClick}
        style={{ cursor: 'pointer' }}
        color="var(--cui-primary)"
      />
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader className="fw-bold">Scan Bar/QR code</CModalHeader>
        <CModalBody className="p-0">
          <BarcodeScanner onScan={handleScan} />
        </CModalBody>
      </CModal>
    </div>
  );
};

export default ChassisNumberSelect;
