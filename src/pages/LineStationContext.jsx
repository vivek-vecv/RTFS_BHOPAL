import React, { createContext, useContext, useState } from 'react';

// Create the context
const LineStationContext = createContext();

// Create a provider component
export const LineStationProvider = ({ children }) => {
  const [lineName, setLineName] = useState('');
  const [stationName, setStationName] = useState('');

  return (
    <LineStationContext.Provider value={{ lineName, setLineName, stationName, setStationName }}>
      {children}
    </LineStationContext.Provider>
  );
};

// Custom hook to use the context
export const useLineStationContext = () => useContext(LineStationContext);
