import React, { createContext, useState, useContext } from 'react';

// Create the context
const SerialNumberContext = createContext();

// Create a provider component
export const SerialNumberProvider = ({ children }) => {
  const [serialNumber, setSerialNumber] = useState('');

  return (
    <SerialNumberContext.Provider value={{ serialNumber, setSerialNumber }}>
      {children}
    </SerialNumberContext.Provider>
  );
};

// Create a custom hook to use the SerialNumberContext
export const useSerialNumberContext = () => useContext(SerialNumberContext);
