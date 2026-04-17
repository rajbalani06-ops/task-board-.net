import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div
        style={{
          background: darkMode ? "#121212" : "#fff",
          color: darkMode ? "#fff" : "#000",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
};