import { createContext, useState, useContext } from 'react';

// Create a Context
export const NavbarContext = createContext();

// Create a Provider component
export const NavbarProvider = ({ children }) => {
  const [navbarData, setNavbarData] = useState(null);

  return <NavbarContext.Provider value={{ navbarData, setNavbarData }}>{children}</NavbarContext.Provider>;
};

export const useNavbar = () => useContext(NavbarContext);
