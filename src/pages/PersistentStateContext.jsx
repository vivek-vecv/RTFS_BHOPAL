import React, { createContext, useContext, useState } from 'react';

const PersistentStateContext = createContext();

export const PersistentStateProvider = ({ children }) => {
  const [state, setState] = useState({
    serialNumber: '',
    orderNumber: '',
    model: '',
    partNumber: '',
    partDescription: '',
    operator: ''
  });

  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState
    }));
  };

  return (
    <PersistentStateContext.Provider value={{ state, updateState }}>
      {children}
    </PersistentStateContext.Provider>
  );
};

export const usePersistentStateContext = () => useContext(PersistentStateContext);
