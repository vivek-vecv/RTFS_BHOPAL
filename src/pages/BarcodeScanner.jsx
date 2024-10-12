import { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BarcodeScanner = ({ onScan }) => {
  const [data, setData] = useState('Not Found');

  return (
    <BarcodeScannerComponent
      width={'100%'}
      onUpdate={(err, result) => {
        if (result) {
          setData(result.text);
          onScan(result.text); // Pass scanned data to parent component
        } else {
          setData('Not Found');
        }
      }}
    />
  );
};

export default BarcodeScanner;
