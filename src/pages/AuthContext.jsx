// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [heading, setHeading] = useState("");

//   const log = () => setIsLoggedIn(true);
//   const logout = () => setIsLoggedIn(false);

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn, log, logout, heading, setHeading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserAuthentication = () => {
      const storedUser = localStorage.getItem("username"); // or however you're storing it
      if (storedUser) {
        setUser(storedUser); // Assuming storedUser is the username
      }
    };

    checkUserAuthentication();
  }, []);

  const login = (username) => {
    localStorage.setItem("username", username.username); // Store the username
    setUser(username); // Set the user state
  };

  const logout = () => {
    localStorage.removeItem("username"); // Remove from storage
    setUser(null); // Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
