import { createContext, useState, useContext } from 'react';

// Create a Context
export const NavbarContext = createContext();

// Create a Provider component
export const NavbarProvider = ({ children }) => {
  const [navbarData, setNavbarData] = useState(null);

  const resetNavbarData = () => {
    setNavbarData(null); // Reset navbar data
  };
  return <NavbarContext.Provider value={{ navbarData, setNavbarData, resetNavbarData }}>{children}</NavbarContext.Provider>;
};

export const useNavbar = () => useContext(NavbarContext);
